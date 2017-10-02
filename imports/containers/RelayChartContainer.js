import { Meteor } from 'meteor/meteor';
import {connect} from 'react-redux-meteor';
import SensorDataModel from '../models/SensorData';
import RelayChart from '../components/RelayChart';

Meteor.subscribe('sensor_data');

const mapStateToProps = (state,ownProps) => {
    return {
        relayboard_id: ownProps.relayboard_id,
        config: ownProps.config,
        number: ownProps.number,
        sensor_data: []
    };
};

const mapTrackerToProps = (state,ownProps) => {
    return {
    };
};

const mapDispatchToProps = (dispaych) => {
    return {
        updateButtonClick: () => {
            this.forceUpdate();
        }
    };
};

var RelayChartContainer = connect(mapTrackerToProps,mapStateToProps,mapDispatchToProps)(RelayChart);

export default RelayChartContainer;