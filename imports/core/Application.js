import EventEmitter from 'events';
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';
import RelayBoard from './RelayBoard';
import RelayBoardsDB  from '../models/RelayBoard';
import _ from 'lodash';

const Application = class extends EventEmitter {
    constructor() {
        super();
        this.relayboards = {};
        var self = this;
        process.env.MAIL_URL="";

        Accounts.emailTemplates.resetPassword.text =(user,url) => {
            url = url.replace(/\#/g,'').replace(/\/\//g,'/');
            return "Hey "+user.username+"!\n\n "+
                "To reset your password, simply click the link below:\n\n"+
                url;
        }

        Meteor.publish('relayboards', function() {
            if (Meteor.userId()) {
                var user = Meteor.users.find({'_id':Meteor.userId()},{relayboards:1}).fetch();
                user = user.shift();
                var ids = [];
                for (var i in user.relayboards) {
                    ids.push(user.relayboards[i]);
                }
                return RelayBoardsDB.find({'_id':{$in:ids}});
            } else {
                this.ready();
            }
        })
        
        Meteor.methods({
            'registerRelayBoard': (params) => {
                if (Meteor.userId()) {
                    var id = params.id;
                    if (!this.relayboards[id] || typeof(this.relayboards[id]) == 'undefined') {
                        params.options['_id'] = id;
                        RelayBoardsDB.insert(params.options);
                        Meteor.users.update({_id: Meteor.userId()}, {'$addToSet': {'relayboards': id}});
                        params.options['application'] = self;
                        this.relayboards[id] = new RelayBoard(id,params.config);
                        return JSON.stringify({status:'ok'});
                    } else {
                        return JSON.stringify({status:'ok'});
                    }
                } else {
                    return JSON.stringify({status:'error',message:'Not authenticated'})
                }
            },
            'unregisterRelayBoard': (params) => {
                if (Meteor.userId()) {
                    var id = params.id;
                    if (this.relayboards[id]) {
                        delete this.relayboards[id];
                    }
                    RelayBoardsDB.delete({_id:id});
                    Meteor.users.update({'relayboards':id},{'$pull':{'relayboards':id}});
                    return JSON.stringify({status:'ok'});
                } else {
                    return JSON.stringify({status:'error',message:'Not authenticated'})
                }
            },
            'updateRelayBoardStatus': (params) => {
                if (params.id && params.status) {
                    if (typeof(this.relayboards[params.id]) != 'undefined' && this.relayboards[params.id]) {
                        this.relayboards[params.id].setStatus(params.status);
                        var commands = {};
                        if (params.command_responses && _.toArray(params.command_responses).length) {
                            this.relayboards[params.id].processCommandResponses(params.command_responses);
                        }
                        for (var i in this.relayboards[params.id].commands_queue) {
                            if (!this.relayboards[params.id].commands_queue[i].sent) {
                                commands[i] = {
                                    request_id: this.relayboards[params.id].commands_queue[i].request_id,
                                    request_type: this.relayboards[params.id].commands_queue[i].request_type,
                                    command: this.relayboards[params.id].commands_queue[i].command,
                                    arguments: this.relayboards[params.id].commands_queue[i].arguments
                                }
                                this.relayboards[params.id].commands_queue[i].sent = true;
                            }
                        }
                        return JSON.stringify({status:'ok',commands:commands});
                    } else {
                        return JSON.stringify({status:'error',message:'Specified relayboard not found'})
                    }
                } else {
                    return JSON.stringify({status:'error',message:'Invalid request'})
                }
            },
            'getStatus': (params) => {
                if (Meteor.userId()) {
                    var relayboards = Meteor.user().relayboards;
                    statuses = [];
                    responses = {};
                    for (var i in relayboards) {
                        if (typeof(relayboards[i])!='undefined' && relayboards[i]) {
                            var relayboard = this.relayboards[relayboards[i]];
                            statuses.push({
                                id: relayboards[i],
                                online: relayboard.getOnline(),
                                status: relayboard.getStatus(),
                                timestamp: relayboard.getTimestamp()
                            });
                            responses[relayboards[i]] = {};
                            for (var i1 in relayboard.command_responses) {
                                responses[relayboards[i]][i1] = relayboard.command_responses[i1];
                            }
                        }
                    }
                    relayboard.command_responses = {};
                    return JSON.stringify({statuses:statuses,command_responses:responses});
                }
            },
            'switchRelay': (params) => {
                if (params.id && params.number && params.mode) {
                    if (Meteor.userId()) {
                        var relayboards = Meteor.user().relayboards;
                        if (relayboards.indexOf(params.id)!=-1 && this.relayboards[params.id] && typeof(this.relayboards[params.id]) != 'undefined') {
                            var request_id = params.id+'_'+Date.now()+'_'+params.mode+'_'+params.number;
                            var command = {
                                request_type: 'serial',
                                request_id: request_id,
                                command: params.mode,
                                arguments: params.number
                            };
                            this.relayboards[params.id].dispatchCommand(command, function(result) {
                            });
                            return JSON.stringify({status:'ok',request_id:request_id});
                        }
                    }
                }
            }
        })
    };

    run() {
        var relayboards = RelayBoardsDB.find().fetch();
        relayboards.forEach((item) => {
            this.relayboards[item._id] = new RelayBoard(item._id,item);
        },this);
    }
}

export default new Application();

