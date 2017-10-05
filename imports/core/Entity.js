import EventEmitter from 'events';

var Entity = class extends EventEmitter {
    getDDPMethods() {
        result = {};
        for (var i in this.ddpMethods) {
            result[this.ddpMethods[i]] = this[this.ddpMethods[i]];
        }
        return result;
    }
};

export default Entity;