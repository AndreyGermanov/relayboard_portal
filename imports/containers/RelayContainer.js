import { Meteor } from 'meteor/meteor';
import {connect} from 'react-redux';
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
        connected: ownProps.connected,
        timestamp: ownProps.timestamp ? moment(ownProps.timestamp).format('HH:mm:ss') : '',
        settings: ownProps.settings
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
        },
        onRelayMouseDown: (relayboard_id,number) => {
            dispatch(dashboardActions.relayMouseDown(relayboard_id,number));
        },
        onRelayMouseUp: (relayboard_id,number) => {
            dispatch(dashboardActions.relayMouseUp(relayboard_id,number));
        },
    };
};

var RelayContainer = connect(mapStateToProps,mapDispatchToProps)(Relay);

export default RelayContainer;