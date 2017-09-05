import EventEmitter from 'events';
import {Accounts} from 'meteor/accounts-base';

const Application = class extends EventEmitter {
    constructor() {
        super();
        Accounts.emailTemplates.resetPassword.text =(user,url) => {
            url = url.replace(/\#/g,'').replace(/\/\//g,'/');
            return "Hey "+user.username+"!\n\n "+
                "To reset your password, simply click the link below:\n\n"+
                url;
        }

    };

    run() {
        console.log('Initialized');
    }
}

export default new Application();

