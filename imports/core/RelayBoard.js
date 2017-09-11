import {EventEmitter} from 'events';

var RelayBoard = class extends EventEmitter {

    constructor(id,options) {
        super();
        this.id = id;
        for (var i in options) {
            this[i] = options[i];
        }
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

}

export default RelayBoard;