import React,{Component} from 'react';
import Entity from './Entity';
import {Link} from 'react-router-dom';
import Store from '../store/Store';
import actions from '../actions/UsersActions';

const User = class extends Entity {
    render() {
        if (!this.props.user_id || (this.props.user && this.props.user.role)) {

            this.prepareForm();

            var error = null;
            var relayboards = this.props.relayboards.map((relayboard) => {
                /*jshint ignore:start */
                return ( <span key={"relayboard_"+relayboard._id}>
                    <input type="checkbox" checked={this.props.user.relayboards ? this.props.user.relayboards.indexOf(relayboard._id)!=-1: false}
                           onChange={this.props.onRelayBoardCheck.bind(this,relayboard._id)}/>&nbsp;{relayboard.config.title}<br/></span>
                );
                /*jshint ignore:end */
            });

            if (this.errors.general.message) {
                /*jshint ignore:start */
                error = <div className="alert alert-danger">{this.errors['general'].message}</div>;
                /*jshint ignore:end */
            }

            return (
                /*jshint ignore:start */
                <div className="panel panel-blur" style={{flex:1}}>
                    <div className="panel-heading">
                        <h3 className="panel-title">{this.props.user_id ? this.props.user.email : 'New user'}
                            <span className="pull-left">
                                <Link to={{pathname:'/users'}}>
                                    <button type='button' className="btn btn-default btn-xs">
                                        <span className="fa fa-arrow-circle-left"/>&nbsp;Back
                                    </button>
                                </Link>&nbsp;
                            </span>
                            <span className="pull-right">
                                <button type='button' className="btn btn-default btn-xs"
                                        onClick={this.props.onSaveClick.bind(this)}>
                                        <span className="fa fa-check"/>&nbsp;Save
                                    </button>
                            </span>
                        </h3>
                    </div>
                    <div className="panel-body">
                        {error}
                        <form className="form-horizontal">
                            <div className={"form-group "+this.errors['email'].error_class}>
                                <label className="col-sm-2">Email (login)</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control"
                                           value={this.props.user.email}
                                           onChange={this.props.onChangeField.bind(this,'email')}/>
                                    {this.errors['email'].message ?
                                        <div className="error">{this.errors['email'].message}</div> : null}
                                </div>
                            </div>
                            <div className={"form-group "+this.errors['password'].error_class}>
                                <label className="col-sm-2">Password</label>
                                <div className="col-sm-10">
                                    <input type="password" className="form-control"
                                           value={this.props.user.password}
                                           onChange={this.props.onChangeField.bind(this,'password')}/>
                                    {this.errors['password'].message ?
                                        <div className="error">{this.errors['password'].message}</div> : null}
                                </div>
                            </div>
                            <div className={"form-group "+this.errors['confirm_password'].error_class}>
                                <label className="col-sm-2">Confirm password</label>
                                <div className="col-sm-10">
                                    <input type="password" className="form-control"
                                           value={this.props.user.confirm_password}
                                           onChange={this.props.onChangeField.bind(this,'confirm_password')}/>
                                    {this.errors['confirm_password'].message ?
                                        <div className="error">{this.errors['confirm_password'].message}</div> : null}
                                </div>
                            </div>
                            <div className={"form-group "+this.errors['username'].error_class}>
                                <label className="col-sm-2">Name</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control"
                                           value={this.props.user.username}
                                           onChange={this.props.onChangeField.bind(this,'username')}/>
                                    {this.errors['username'].message ?
                                        <div className="error">{this.errors['username'].message}</div> : null}
                                </div>
                            </div>
                            <div className={"form-group "+this.errors['role'].error_class}>
                                <label className="col-sm-2">Role</label>
                                <div className="col-sm-10">
                                    <select className="form-control" value={this.props.user.role}
                                            onChange={this.props.onChangeField.bind(this,'role')}>
                                        <option value="user">User</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                                {this.errors['role'].message ?
                                    <div className="error">{this.errors['role'].message}</div> : null}
                            </div>
                            <div className="form-group">
                                <label className="col-sm-2">Relay Boards</label>
                                <div className="col-sm-10">
                                    {relayboards}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                /*jshint ignore:end */
            );
        } else {
            return (
                /*jshint ignore:start */
                <div>Loading ...</div>
                /*jshint ignore:end */
            );
        }
    }

    prepareForm() {
        this.errors = {
            general: {
                message: ''
            },
            email: {
                error_class: '',
                message: ''
            },
            username: {
                error_class: '',
                message: ''
            },
            role: {
                error_class: '',
                message: ''
            },
            relayboards: {
                error_class: '',
                message: ''
            },
            password: {
                error_class: '',
                message: ''
            },
            confirm_password: {
                error_class: '',
                message: ''
            }
        };
        for (var i in this.props.errors) {
            this.errors[i].error_class = 'has-error';
            this.errors[i].message = this.props.errors[i];
        }
    }

    componentWillUnmount() {
        Store.store.dispatch(actions.updateUser(null));
    }
};

export default User;