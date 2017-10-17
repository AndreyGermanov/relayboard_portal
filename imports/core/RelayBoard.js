import {EventEmitter} from 'events';
import RelayBoardsDB  from '../models/RelayBoard';
import SensorData from '../models/SensorData';
import {Meteor} from 'meteor/meteor';
import _ from 'lodash';

var RelayBoard = class extends EventEmitter {

    constructor(id,options) {
        super();
        this.id = id;
        this.commands_queue = {};
        this.command_responses = {};
        this.connected = {};
        this.lastConfigUpdateTime = Date.now();
        this.terminal_buffer = [];
        for (var i in options) {
            this[i] = options[i];
        }
        Meteor.setInterval(this.handleCommandQueue.bind(this),5000);
    }

    setStatus(status,timestamp,terminal_buffer) {
        this.status = status;
        this.status_timestamp = timestamp;
        this.online_timestamp = Date.now();
        var command = {
            status:this.status,
            status_timestamp:this.status_timestamp,
            online_timestamp:this.online_timestamp,
            online: this.getOnline(),
            connected: this.getConnected(),
            buffer:terminal_buffer,
        };
        RelayBoardsDB.update(
            {
                '_id':this.id
            },
            {
                '$set':command
            }
        );
    }

    setConfig(config) {
        this.config = config;
        this.config_timestamp = Date.now();
        RelayBoardsDB.update(
            {'_id':this.id},
            {
                '$set':
                {
                    config:this.config,
                    config_timestamp:this.config_timestamp
                }
            }
        );
    }

    getStatus() {
        return this.status;
    }

    getConnected() {
        RelayBoardsDB.update(
            {
                '_id':this.id
            },
            {
                '$set':
                {
                    connected:Date.now()-this.status_timestamp<10000
                }
            }
        );
        return Date.now()-this.status_timestamp<10000;
    }

    getConfig() {
        this.config.pins = _.orderBy(this.config.pins,['number'],['asc']);
        return this.config;
    }

    getOnline() {
        RelayBoardsDB.update(
            {
                '_id':this.id
            },
            {
                '$set':
                {
                    online:Date.now()-this.online_timestamp<10000
                }
            }
        );
        return Date.now()-this.online_timestamp<10000;
    }

    getTimestamp() {
        return this.timestamp;
    }

    setConfigUpdateTime(timestamp) {
        this.lastConfigUpdateTime = timestamp;
    }

    getConfigUpdateTime() {
        return this.lastConfigUpdateTime;
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
        this.getOnline();
        for (var i in this.commands_queue) {
            if (Date.now() - this.commands_queue[i].timestamp > 20000) {
                delete this.commands_queue[i];
            }
        }
    }
    
    getSensorData(params) {

        var fields_to_display = {timestamp:1};

        var conditions_exists = [],
            condition_exists = {};

        for (var i in params.series) {
            if (typeof(fields_to_display[params.series[i]]) == 'undefined') {
                fields_to_display[params.series[i]] = 1;
                condition_exists[params.series[i]] = {'$exists':true};
                conditions_exists.push(condition_exists);
                condition_exists = {};
            }
        }

        var condition = {relayboard_id:params.relayboard_id,
            pin:params.number,
            '$or': conditions_exists,
            '$and': [ {'timestamp': {'$gte': params.dateStart}},{'timestamp': {'$lte':params.dateEnd}}]};

        return SensorData.find(condition,{fields:fields_to_display,sort:['timestamp','asc']}).fetch();
    }
};

export default RelayBoard;