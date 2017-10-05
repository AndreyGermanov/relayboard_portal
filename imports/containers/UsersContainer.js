import { Meteor } from 'meteor/meteor';
import {connect} from 'react-redux';
import Users from '../components/Users';
import actions from '../actions/UsersActions';

const mapStateToProps = (state,ownProps) => {
    return {
        errors: state.Users.errors,
        users: ownProps.users,
        user: ownProps.user,
        relayboards: ownProps.relayboards
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteClick: (id) => {
            if (confirm('Are you sure ?')) {
                dispatch(actions.deleteUser(id));
            }
        }
    };
};

var UsersContainer = connect(mapStateToProps,mapDispatchToProps)(Users);

export default UsersContainer;


