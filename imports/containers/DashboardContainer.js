import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import {connect} from 'react-redux';
import RelayboardModel from '../models/RelayBoard';
import Dashboard from '../components/Dashboard';
import Store from '../store/Store';

const mapStateToProps = (state,ownProps) => {
    return {
        errors: state.Dashboard.errors,
        relayboards: state.Dashboard.relayboards,
        relayChartSettings: state.relay
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

var DashboardContainer = connect(mapStateToProps,mapDispatchToProps)(Dashboard);

export default DashboardContainer;


