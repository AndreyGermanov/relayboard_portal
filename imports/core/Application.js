import EventEmitter from 'events';
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';
import RelayBoard from './RelayBoard';
import RelayBoardsDB  from '../models/RelayBoard';
import Users from './Users';
import _ from 'lodash';

const Application = class extends EventEmitter {
    constructor() {
        super();
        this.relayboards = {};
        var self = this;
        process.env.MAIL_URL="";

        this.users = new Users();


        Accounts.emailTemplates.resetPassword.text =(user,url) => {
            url = url.replace(/\#/g,'').replace(/\/\//g,'/');
            return "Hey "+user.username+"!\n\n "+
                "To reset your password, simply click the link below:\n\n"+
                url;
        };

        Meteor.publish('relayboards', function() {
            if (Meteor.userId()) {
                var user = Meteor.users.find({'_id':Meteor.userId()},{relayboards:1}).fetch();
                user = user.shift();
                var condition = {};
                if (user.role != 'admin') {
                    var ids = [];
                    for (var i in user.relayboards) {
                        ids.push(user.relayboards[i]);
                    }
                    condition = {'_id': {$in: ids}};
                }
                return RelayBoardsDB.find(condition);
            } else {
                this.ready();
            }
        });

        Meteor.publish('Meteor.users', function() {
            if (Meteor.userId()) {
                var user = Meteor.users.findOne({'_id':Meteor.userId()},{relayboards:1});
                if (user.role == 'admin') {
                    return Meteor.users.find({}, {relayboards: 1});
                } else {
                    return Meteor.users.find({'_id':Meteor.userId()},{relayboards:1});
                }
            }
        });
        var methods = {
            'registerRelayBoard': (params) => {
                if (Meteor.userId()) {
                    var id = params.id;
                    if (!this.relayboards[id] || typeof(this.relayboards[id]) == 'undefined') {
                        params.options._id = id;
                        RelayBoardsDB.insert(params.options);
                        Meteor.users.update({_id: Meteor.userId()}, {'$addToSet': {'relayboards': id}});
                        params.options.application = self;
                        this.relayboards[id] = new RelayBoard(id,params.config);
                        return JSON.stringify({status:'ok'});
                    } else {
                        return JSON.stringify({status:'ok'});
                    }
                } else {
                    return JSON.stringify({status:'error',message:'Not authenticated'});
                }
            },
            'updateRelayBoardConfig': (params) => {
                if (Meteor.userId()) {
                    var id = params.id;
                    params.config.pins = _.orderBy(params.config.pins,['number'],['asc']);
                    if (this.relayboards[id] && typeof(this.relayboards[id]) != 'undefined') {
                        this.relayboards[id].setConfigUpdateTime(params.lastConfigUpdateTime);
                        this.relayboards[id].setConfig(params.config);
                    }
                    return JSON.stringify({status:'ok'});
                }
            },
            'unregisterRelayBoard': (params) => {
                if (Meteor.userId()) {
                    var id = params.id;
                    if (this.relayboards[id]) {
                        delete this.relayboards[id];
                    }
                    RelayBoardsDB.remove({_id:id});
                    Meteor.users.update({'relayboards':id},{'$pull':{'relayboards':id}});
                    return JSON.stringify({status:'ok'});
                } else {
                    return JSON.stringify({status:'error',message:'Not authenticated'});
                }
            },
            'updateRelayBoardStatus': (params) => {
                if (params.id && params.status) {
                    if (typeof(this.relayboards[params.id]) != 'undefined' && this.relayboards[params.id]) {
                        this.relayboards[params.id].setStatus(params.status,params.timestamp,params.terminal_buffer);
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
                                };
                                this.relayboards[params.id].commands_queue[i].sent = true;
                            }
                        }
                        return JSON.stringify({status:'ok',commands:commands,lastConfigUpdateTime:this.relayboards[params.id].getConfigUpdateTime()});
                    } else {
                        return JSON.stringify({status:'error',message:'Specified relayboard not found'});
                    }
                } else {
                    return JSON.stringify({status:'error',message:'Invalid request'});
                }
            },
            'getConfig': (params) => {
                if (Meteor.userId()) {
                    var relayboards = Meteor.user().relayboards;
                    results = [];
                    for (var i in relayboards) {
                        if (typeof(relayboards[i]) != 'undefined' && relayboards[i]) {
                            var relayboard = this.relayboards[relayboards[i]];
                            results.push({
                                id: relayboard.id,
                                config: relayboard.getConfig()
                            });
                        }
                    }
                    return JSON.stringify({status:'ok',relayboards:results});
                } else {
                    return JSON.stringify({status:'error',message:'Authentication error'});
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
                            var status = {
                                id: relayboard.id,
                                online: relayboard.getOnline(),
                                status: relayboard.getStatus(),
                                timestamp: relayboard.getTimestamp()
                            };
                            if (typeof(params.lastConfigUpdateTime)!='undefined' && params.lastConfigUpdateTime<relayboard.lastConfigUpdateTime) {
                                status.config = relayboard.getConfig();
                            }
                            statuses.push(status);
                            responses[relayboards[i]] = {};
                            for (var i1 in relayboard.command_responses) {
                                responses[relayboards[i]][i1] = relayboard.command_responses[i1];
                            }
                            relayboard.command_responses = {};
                        }
                    }
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
            },
            'execCommand': (params) => {
                if (params.id) {
                    if (Meteor.userId()) {
                        var relayboards = Meteor.user().relayboards;
                        if (relayboards.indexOf(params.id) != -1 && this.relayboards[params.id] && typeof(this.relayboards[params.id]) != 'undefined') {
                            var request_id = 'terminal_cmd';
                            var command = {
                                request_type: 'terminal',
                                request_id: request_id,
                                command: params.command,
                                arguments: null
                            };
                            this.relayboards[params.id].dispatchCommand(command, function (result) {
                            });
                            return JSON.stringify({status: 'ok', request_id: request_id});
                        }
                    }
                }
            },
            getSensorData: (params) => {
                if (Meteor.userId()) {
                    if (params.relayboard_id && params.number && params.series && params.series.length) {
                        var relayboard = this.relayboards[params.relayboard_id];
                        var sensor_data = relayboard.getSensorData(params);
                        try {
                            sensor_data = JSON.stringify(sensor_data);
                        } catch (e) {
                            return e;
                        }
                        return sensor_data;
                    }
                }
            }
        };

        var users_methods = this.users.getDDPMethods();

        for (var i in users_methods) {
            methods[i] = users_methods[i];
        }

        Meteor.methods(methods);
    }

    run() {
        var relayboards = RelayBoardsDB.find().fetch();
        relayboards.forEach((item) => {
            this.relayboards[item._id] = new RelayBoard(item._id,item);
        },this);
    }
};

export default new Application();

