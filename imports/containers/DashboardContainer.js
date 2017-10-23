import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import {connect} from 'react-redux';
import RelayboardModel from '../models/RelayBoard';
import Dashboard from '../components/Dashboard';
import actions from '../actions/DashboardActions';
import Store from '../store/Store';

const mapStateToProps = (state,ownProps) => {
    return {
        errors: state.Dashboard.errors,
        relayboards: state.Dashboard.relayboards,
        user: ownProps.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onMouseUp: () => {
            dispatch(actions.dashboardMouseUp());
        }
    };
};

var DashboardContainer = connect(mapStateToProps,mapDispatchToProps)(Dashboard);

export default DashboardContainer;


