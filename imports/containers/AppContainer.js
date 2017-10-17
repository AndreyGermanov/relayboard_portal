import {connect} from 'react-redux';
import App from '../components/App';
import actions from '../actions/AppActions';
import dashboardActions from '../actions/DashboardActions';
import RelayboardModel from '../models/RelayBoard';
import {Meteor} from 'meteor/meteor';
import Store from '../store/Store';
import { withTracker } from 'meteor/react-meteor-data';

const mapStateToProps = (state) => {
    return {
        sideMenuVisible: state.sideMenuVisible,
        userMenuVisible: state.userMenuVisible
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSideMenuClick: (e) => {
            e.preventDefault();
            dispatch(actions.toggleSideMenu());
        },
        onUserMenuClick: (e) => {
            e.stopPropagation();
            e.preventDefault();
            dispatch(actions.toggleUserMenu());
        },
        onLogoutClick: (e) => {
            e.preventDefault();
            Meteor.logout();
        },
        onBodyClick: () => {
            dispatch(actions.toggleUserMenu(false));
        }
    };
};

var AppContainer = withTracker(() => {
    Meteor.subscribe('Meteor.users');
    Meteor.subscribe('relayboards');
    var relayboards = RelayboardModel.find({},
        {
            '_id':1,
            'status':1,
            'online_timestamp':1,
            'status_timestamp':1,
            'connected':1,
            'online':1,
            'config':1
        }).fetch();
    Store.store.dispatch(dashboardActions.setRelayBoards(relayboards));
    return {
        users: Meteor.users.find({},{relayboards:1,role:1}).fetch(),
        user: Meteor.users.findOne({'_id':Meteor.userId()},{role:1,relayboards:1}),
        relayboards: relayboards
    };
})(connect(mapStateToProps,mapDispatchToProps)(App));

export default AppContainer;