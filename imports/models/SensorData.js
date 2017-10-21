import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import data_config from '../../imports/config/data';
import async from 'async';
import Application from '../core/Application';
import _ from 'lodash';

Mongo.Collection.prototype.aggregate = function(pipelines, options) {
    var coll;
    if (this.rawCollection) {
        // >= Meteor 1.0.4
        coll = this.rawCollection();
    } else {
        // < Meteor 1.0.4
        coll = this._getCollection();
    }
    return coll.aggregate(pipelines, options).toArray();
};

const SensorData = {};

data_config.aggregate_levels.forEach((aggregate) => {
    SensorData[aggregate] = new Mongo.Collection('sensor_data_'+aggregate);
    SensorData[aggregate]._ensureIndex({"timestamp":1});
    SensorData[aggregate]._ensureIndex({"relayboard_id":1});
    SensorData[aggregate]._ensureIndex({"relayboard_id":1,"sensor_id":1,"timestamp":1});
    SensorData[aggregate]._ensureIndex({"relayboard_id":1,"sensor_id":1});
});

const updateAggregates = () => {
    async.eachSeries(Application.relayboards,(relayboard,callback) => {
        async.eachSeries(relayboard.config.pins,(sensor,callback) => {
            async.eachOfSeries(data_config.aggregate_levels,(aggregate_level,aggregate_index,callback) => {

                if (typeof(data_config.aggregate_levels[aggregate_index+1])== 'undefined') {
                    callback();
                    return;
                }

                const current_source = SensorData[aggregate_level];
                const next_source = SensorData[data_config.aggregate_levels[aggregate_index+1]];
                var fields_to_get = {_id: '$aggregate_number'},
                    fields_to_insert = {};


                switch (sensor.type) {
                    case 'temperature':
                        fields_to_get['temperature_avg'] = {$avg:'$temperature_avg'};
                        fields_to_get['temperature_min'] = {$avg:'$temperature_min'};
                        fields_to_get['temperature_max'] = {$avg:'$temperature_max'};
                        fields_to_get['humidity_avg'] = {$avg:'$humidity_avg'};
                        fields_to_get['humidity_min'] = {$avg:'$humidity_min'};
                        fields_to_get['humidity_max'] = {$avg:'$humidity_max'};
                        fields_to_insert['temperature_avg'] = fields_to_insert['temperature_min'] = fields_to_insert['temperature_max'] = 1;
                        fields_to_insert['humidity_avg'] = fields_to_insert['humidity_min'] = fields_to_insert['humidity_max'] = 1;
                        break;
                    case 'relay':
                        fields_to_get['status_avg'] = {$avg:'$status_avg'};
                        fields_to_get['status_min'] = {$avg:'$status_min'};
                        fields_to_get['status_max'] = {$avg:'$status_max'};
                        fields_to_insert['status_avg'] = fields_to_insert['status_min'] = fields_to_insert['status_max'] = 1;
                        break;
                    default:
                }

                var last_timestamp = 0;

                async.series([
                    function(callback) {
                        var result = next_source.find(
                            {
                                relayboard_id:relayboard.id,
                                sensor_id:sensor.number
                            },
                            {
                                sort:{'timestamp':-1},
                                limit:1
                            }
                        ).fetch()[0];

                        if (result && result.timestamp) {
                            last_timestamp = result.timestamp;
                        }
                        callback();
                    },
                    function(callback) {
                        current_source.aggregate([
                            {
                                $match:
                                {
                                    relayboard_id:relayboard.id,
                                    sensor_id:sensor.number,
                                    timestamp: {$gt: last_timestamp}
                                }
                            },
                            {
                                $project:
                                {
                                    relayboard_id:1,
                                    sensor_id:1,
                                    _id: 0,
                                    aggregate_number:
                                    {
                                        $multiply: [
                                            {
                                                $floor:
                                                {
                                                    $divide:
                                                        [
                                                            '$timestamp',
                                                            data_config.aggregate_levels[aggregate_index+1]
                                                        ]
                                                }
                                            },data_config.aggregate_levels[aggregate_index+1]
                                        ]
                                    },
                                    ...fields_to_insert

                                }
                            },
                            {
                                $group: fields_to_get
                            },
                            {
                                $sort: {
                                    '_id': 1
                                }
                            }]
                        ).then((result) => {
                            if (result) {
                                for (var i in result) {
                                    var record = _.cloneDeep(result[i]);
                                    var record = {
                                        relayboard_id: relayboard.id,
                                        sensor_id: sensor.number,
                                        timestamp: result[i]._id,
                                        ...record
                                    };
                                    delete record._id;
                                    next_source.update(
                                        {
                                            relayboard_id:relayboard.id,
                                            sensor_id:sensor.number,
                                            timestamp:record.timestamp},
                                        record,{upsert:true}
                                    )
                                }
                            }
                            callback();
                        });
                    }
                ], function() {
                    callback();
                })
            }, () => {
                callback();
            });
        }, () => {
            callback();
        })
    }, () => {
    });
}

Meteor.setInterval(updateAggregates,60000);

export default SensorData;