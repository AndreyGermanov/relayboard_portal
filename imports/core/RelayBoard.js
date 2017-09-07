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
    }

}

export default RelayBoard;