import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import {connect} from 'react-redux-meteor';
import RelayboardModel from '../models/RelayBoard';
import Dashboard from '../components/Dashboard';
import Store from '../store/Store';

const mapStateToProps = (state,ownProps) => {
    return {
        errors: state.Dashboard.errors,
        relayboards: ownProps.relayboards,
        relayChartSettings: state.relay
    };
};

const mapTrackerToProps = (state,props) => {
        return {
        };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

var DashboardContainer = connect(mapTrackerToProps,mapStateToProps,mapDispatchToProps)(Dashboard);

export default DashboardContainer;


