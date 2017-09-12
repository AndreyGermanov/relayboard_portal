import {EventEmitter} from 'events';

var RelayBoard = class extends EventEmitter {

    constructor(id,options) {
        super();
        this.id = id;
        this.commands_queue = {};
        this.command_responses = {};
        for (var i in options) {
            this[i] = options[i];
        }
        setInterval(this.handleCommandQueue.bind(this),5000);
    }

    setStatus(status) {
        this.status = status;
        this.timestamp = Date.now();
    }

    getStatus() {
        return this.status;
    }

    getOnline() {
        return Date.now()-this.timestamp<10000;
    }

    getTimestamp() {
        return this.timestamp;
    }

    dispatchCommand(command,callback) {
        command.callback = callback;
        command.timestamp = Date.now();
        this.commands_queue[command.request_id] = command;
    }

    processCommandResponses(responses) {
        for (var i in responses) {
            this.command_responses[i] = responses[i];
            if (this.commands_queue[i]) {
                this.commands_queue[i].callback(responses[i]);
                delete this.commands_queue[i];
            }
        }
    }

    handleCommandQueue() {
        for (var i in this.commands_queue) {
            if (Date.now() - this.commands_queue[i].timestamp > 20000) {
                delete this.commands_queue[i];
            }
        }
    }

}

export default RelayBoard;