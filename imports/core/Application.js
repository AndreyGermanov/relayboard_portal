import EventEmitter from 'events';
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';
import RelayBoard from './RelayBoard';
import RelayBoardsDB  from '../models/RelayBoard';

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
                        console.log(params.status);
                        return JSON.stringify({status:'ok'})
                    } else {
                        return JSON.stringify({status:'error',message:'Specified relayboard not found'})
                    }
                } else {
                    return JSON.stringify({status:'error',message:'Invalid request'})
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

