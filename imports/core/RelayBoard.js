import {EventEmitter} from 'events';
import RelayBoardsDB  from '../models/RelayBoard';
import SensorData from '../models/SensorData';
import {Meteor} from 'meteor/meteor';
import _ from 'lodash';
import async from 'async';

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

        var fields_to_display = {timestamp:{$multiply:["$timestamp",1000]},_id:0};

        var conditions_exists = [],
            condition_exists = {};
        for (var i in params.series) {
            if (typeof(fields_to_display[params.series[i]]) == 'undefined') {
                fields_to_display[params.series[i]] = "$"+params.series[i]+'_avg';
                condition_exists[params.series[i]+'_avg'] = {'$exists':true};
                conditions_exists.push(condition_exists);
                condition_exists = {};
            }
        }
        var condition = {},
            result = [];

        var condition = {relayboard_id:params.relayboard_id,
            sensor_id:params.number,
            '$or': conditions_exists,
            '$and': [ {'timestamp': {'$gte': params.dateStart/1000}},{'timestamp': {'$lte':params.dateEnd/1000}}]};
        return SensorData[15].aggregate([{$match: condition}, {$project: fields_to_display}, {$sort: {'timestamp': 1}}], {cursor: {batchSize: 1000}});
    }

    saveData(data,callback) {
        var aggregate_data = {};
        data.split('|').forEach((line) => {
            try {
                line = JSON.parse(line);
                if (line.timestamp<1483228800) {
                    return;
                }
                if (!aggregate_data[line.aggregate_level]) {
                    aggregate_data[line.aggregate_level] = [];
                }
                var row = {
                    relayboard_id: this.id,
                    timestamp: line.timestamp,
                    sensor_id: line.sensor_id
                }
                for (var field in line.fields) {
                    for (var aggregate in line.fields[field]) {
                        row[field+'_'+aggregate] = line.fields[field][aggregate];
                    }
                }
                aggregate_data[line.aggregate_level].push(row);
            } catch (e) {
            }
        },this);
        async.eachOfSeries(aggregate_data,(aggregate,aggregate_index,callback) => {
            async.eachOfSeries(aggregate,(row,row_index,callback) => {
                SensorData[aggregate_index].update(
                    {
                        timestamp:row.timestamp,
                        sensor_id:row.sensor_id
                    },row,
                    {
                        upsert:true
                    }
                );
                callback();
            }, () => {
                callback();
            })
        },() => {
            if (callback) {
                callback({status:'ok'});
            }
        });
    }
};

export default RelayBoard;