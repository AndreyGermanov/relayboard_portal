import {Mongo} from 'meteor/mongo';
import data_config from '../../imports/config/data';

const SensorData = {};

data_config.aggregate_levels.forEach((aggregate) => {
    SensorData[aggregate] = new Mongo.Collection('sensor_data_'+aggregate);
});

export default SensorData;