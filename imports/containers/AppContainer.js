import {connect} from 'react-redux-meteor';
import App from '../components/App';
import actions from '../actions/AppActions';
import dashboardActions from '../actions/DashboardActions';
import RelayboardModel from '../models/RelayBoard';
import {Meteor} from 'meteor/meteor';
import Store from '../store/Store';

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
        onBodyClick: (e) => {
            dispatch(actions.toggleUserMenu(false));
        }
    };
};

const mapTrackerToProps = (state,ownProps) => {
    Meteor.subscribe('Meteor.users');
    Meteor.subscribe('relayboards');
    var relayboards = RelayboardModel.find({},{'_id':1,'status':1,'timestamp':1,'config':1}).fetch();
    Store.store.dispatch(dashboardActions.setRelayBoards(relayboards));
    return {
        users: Meteor.users.find({},{relayboards:1}).fetch(),
        user: Meteor.users.findOne({'_id':Meteor.userId()},{role:1}),
        relayboards: relayboards
    };
};

var AppContainer = connect(mapTrackerToProps,mapStateToProps,mapDispatchToProps)(App);

export default AppContainer;


