import {Mongo} from 'meteor/mongo';

const SensorData = new Mongo.Collection('sensor_data');

export default SensorData;