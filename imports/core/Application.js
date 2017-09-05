import EventEmitter from 'events';

const Application = class extends EventEmitter {
    constructor() {
        super();
    }
    run() {
        console.log('Initialized');
    }
}

export default new Application();

