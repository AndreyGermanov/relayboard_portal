import { Meteor } from 'meteor/meteor';
import {connect} from 'react-redux';
import Relayboard from '../components/Relayboard';
import actions from '../actions/DashboardActions';

const mapStateToProps = (state,ownProps) => {
    var current_relay = null;
    if (state.Dashboard.relayboards[ownProps.relayboard._id] && state.Dashboard.relayboards[ownProps.relayboard._id].current_relay!==null) {
        current_relay = state.Dashboard.relayboards[ownProps.relayboard._id].current_relay;
    }
    return {
        relayboard: ownProps.relayboard,
        current_relay: current_relay
    };
};

const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        onRemoveRelayboardClick: (id) => {
            if (confirm('Are you sure?')) {
                Meteor.call('unregisterRelayBoard', {id: id}, function (err, result) {
                });
            }
        }
    };
};

var RelayboardContainer = connect(mapStateToProps,mapDispatchToProps)(Relayboard);

export default RelayboardContainer;