import { Meteor } from 'meteor/meteor';
import {connect} from 'react-redux-meteor';
import SensorDataModel from '../models/SensorData';
import Relay from '../components/Relay';
import moment from 'moment';
import dashboardActions from '../actions/DashboardActions';

const mapStateToProps = (state,ownProps) => {
    return {
        relayboard_id: ownProps.relayboard_id,
        status: ownProps.status,
        config: ownProps.config,
        index: ownProps.index,
        online: ownProps.online,
        timestamp: moment(ownProps.timestamp).format('HH:mm:ss')
    };
};

const mapTrackerToProps = (state,props) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRelayClick: (id,command,number) => {
            Meteor.call('switchRelay',{id:id,number:number,mode:command},function(err,result) {
            });
        },
        onRelayChartButtonClick: (relayboard_id,number) => {
            dispatch(dashboardActions.setCurrentRelayboardChart(relayboard_id,number));
        }
    };
};

var RelayContainer = connect(mapTrackerToProps,mapStateToProps,mapDispatchToProps)(Relay);

export default RelayContainer;