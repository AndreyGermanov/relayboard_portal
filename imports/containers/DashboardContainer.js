import _ from 'lodash';
import { Meteor } from 'meteor/meteor'
import {connect} from 'react-redux-meteor';
import RelayboardModel from '../models/RelayBoard';
import Dashboard from '../components/Dashboard';
import Store from '../store/Store';

const mapStateToProps = (state) => {
    var user = Meteor.users.find({}).fetch();
    return {
//        user: user,
        //users: Meteor.users.find().fetch(),
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
        onRelayClick: (id,command,number) => {
            Meteor.call('switchRelay',{id:id,number:number,mode:command},function(err,result) {
            });
        },
        onRemoveRelayboardClick: (id) => {
            if (confirm('Are you sure?')) {
                Meteor.call('unregisterRelayBoard', {id: id}, function (err, result) {
                });
            }
        }
    };
}

var DashboardContainer = connect(mapTrackerToProps,mapStateToProps,mapDispatchToProps)(Dashboard);

export default DashboardContainer;


