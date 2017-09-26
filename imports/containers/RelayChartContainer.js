import { Meteor } from 'meteor/meteor'
import {connect} from 'react-redux-meteor';
import SensorDataModel from '../models/SensorData';
import RelayChart from '../components/RelayChart';

const mapStateToProps = (state,ownProps) => {
    return {
        relayboard_id: ownProps.relayboard_id,
        config: ownProps.config,
        number: ownProps.number
    }
};

const mapTrackerToProps = (state,ownProps) => {
        Meteor.subscribe('sensor_data');
        return {
            sensor_data: SensorDataModel.find({relayboard_id:ownProps.relayboard_id,pin:parseInt(ownProps.number)},
                {sort:{'timestamp':1}})
                .fetch()
        }
};

const mapDispatchToProps = (dispaych) => {
    return {
        updateButtonClick: () => {
            this.forceUpdate();
        }
    }
};

var RelayChartContainer = connect(mapTrackerToProps,mapStateToProps,mapDispatchToProps)(RelayChart);

export default RelayChartContainer;