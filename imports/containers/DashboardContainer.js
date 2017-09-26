import _ from 'lodash';
import { Meteor } from 'meteor/meteor'
import {connect} from 'react-redux-meteor';
import RelayboardModel from '../models/RelayBoard';
import Dashboard from '../components/Dashboard';
import Store from '../store/Store';

const mapStateToProps = (state) => {
    return {
        errors: state.Dashboard.errors
    }
}

const mapTrackerToProps = (state,props) => {
        Meteor.subscribe('Meteor.users');
        Meteor.subscribe('relayboards');
        return {
            relayboards: RelayboardModel.find({},{'_id':1,'status':1,'timestamp':1,'config':1}).fetch()
        }
}
const mapDispatchToProps = (dispatch) => {
    return {
    };
}

var DashboardContainer = connect(mapTrackerToProps,mapStateToProps,mapDispatchToProps)(Dashboard);

export default DashboardContainer;


