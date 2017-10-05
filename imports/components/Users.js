import {Meteor} from 'meteor/meteor';
import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import Entity from './Entity';
import _ from 'lodash';

const Users = class extends Entity {
    render() {
        var rows = null,
            error = null;
        if (!Meteor.userId() || Meteor.user().role != 'admin') {
            /*jshint ignore:start */
            return <Redirect to="/dashboard"/>
            /*jshint ignore:end */
        }
        if (this.props.errors.general) {
            /*jshint ignore:start */
            error = <div className="alert alert-danger">{this.props.errors.general}</div>
            /*jshint ignore:end */
        }
        if (this.props.users && this.props.users.length) {
            rows = this.props.users.map((user) => {
                var relayboards_string = [];
                if (user.relayboards) {
                    for (var i in user.relayboards) {
                        var relayboard = _.find(this.props.relayboards,{_id:user.relayboards[i]});
                        if (relayboard) {
                            relayboards_string.push(relayboard.config.title+' ('+relayboard._id+')');
                        }
                    }
                }
                return (
                    /*jshint ignore:start */
                    <tr key={'user_'+user._id}>
                        <td><Link to={{pathname:'/user/'+user._id}}>{user.emails[0].address}</Link></td>
                        <td><Link to={{pathname:'/user/'+user._id}}>{user.username}</Link></td>
                        <td><Link to={{pathname:'/user/'+user._id}}>{relayboards_string.join('<br>')}</Link></td>
                        <td>
                            <button onClick={this.props.onDeleteClick.bind(this,user._id)}
                                    className="btn btn-xs btn-danger"><span className="fa fa-remove"/>&nbsp;Delete
                            </button>
                        </td>
                    </tr>
                    /*jshint ignore:end */
                );
            });
        }
        return (
            /*jshint ignore:start */
            <div className="panel panel-blur" style={{flex:1}}>
                <div className="panel-heading">
                    <h3 className="panel-title">Users
                    <span className="pull-right">
                        <Link to={{pathname:'/user'}}>
                            <button type='button' className="btn btn-default btn-xs">
                                <span className="fa fa-plus"/>&nbsp;New user
                            </button>
                        </Link>
                    </span>
                    </h3>
                </div>
                <div className="panel-body">
                    {error}
                    <br/>
                    <table className="table table-bordered table-striped table-hover">
                        <tbody>
                        <tr>
                            <th>Login (email)</th>
                            <th>Name</th>
                            <th>Relay Boards</th>
                            <th>Actions</th>
                        </tr>
                        {rows}
                        </tbody>
                    </table>
                </div>
            </div>
            /*jshint ignore:end */
        );
    }
};

export default Users;