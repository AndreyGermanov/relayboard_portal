import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import data_config from '../../imports/config/data';
import async from 'async';
import Application from '../core/Application';

const SensorData = {};

data_config.aggregate_levels.forEach((aggregate) => {
    SensorData[aggregate] = new Mongo.Collection('sensor_data_'+aggregate);
});

const updateAggregates = () => {
    async.eachSeries(Application.relayboards,(relayboard,callback) => {
        async.eachSeries(relayboard.config.pins,(sensor,callback) => {
            async.eachOfSeries(data_config.aggregate_levels,(aggregate_level,aggregate_index,callback) => {

                if (typeof(data_config.aggregate_levels[aggregate_index])== 'undefined') {
                    callback();
                    return;
                }

                const current_source = SensorData[aggregate_level];
                var result = current_source.aggregate(
                    {
                        $match:
                        {
                            relayboard_id:relayboard.id,
                            sensor_id:sensor.number
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
                                $floor:
                                {
                                    $divide:
                                        [
                                            '$timestamp',
                                            data_config.aggregate_levels[aggregate_index+1]
                                        ]
                                }
                            },
                            timestamp: 1
                        }
                    }
                );
                console.log(result);
                callback();
            }, () => {
                callback();
            });
        }, () => {
            callback();
        })
    }, () => {
    });
}

//Meteor.setInterval(updateAggregates,5000);

export default SensorData;