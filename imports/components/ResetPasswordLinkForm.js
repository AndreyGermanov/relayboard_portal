import React,{Component} from 'react';
import Entity from './Entity';

const ResetPasswordLinkForm = class extends Entity {
    render() {
        var fields = {
            email: {
                has_error_class: '',
                placeholder: 'email'
            },
            general: {
                message: ''
            }
        };
        if (typeof(this.props.errors.email)!='undefined' && this.props.errors.email) {
            fields.email = {
                has_error_class: 'has-error',
                placeholder: this.props.errors.email
            };
        }
        if (typeof(this.props.errors.general)!='undefined' && this.props.errors.general) {
            fields.general = {
                message: this.props.errors.general
            };
        }
        if (!this.props.email_sent) {
            return (
                /*jshint ignore:start */
                <div className="outer">
                    <div className="middle">
                        <main className="auth-main inner">
                            <div className="auth-block">
                                <h1>Enter your email address</h1>
                                <div className="alert bg-danger"
                                     style={{display:(fields.general.message.length ? '':'none')}}>{fields.general.message}</div>
                                <form className="form-horizontal" onSubmit={this.props.onFormSubmit}>
                                    <div className={"form-group "+fields.email.has_error_class}>
                                        <label htmlFor="email" className="col-sm-2 control-label">Email</label>
                                        <div className="col-sm-10">
                                            <div className="input-group">
                                                <span
                                                    className="input-group-addon input-group-addon-primary addon-left">
                                                    <i className="fa fa-user"></i>
                                                </span>
                                                <input type="email" id="email" className='form-control'
                                                       placeholder={fields.email.placeholder}
                                                       value={this.props.email}
                                                       onChange={this.props.onChangeEmailField}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-offset-2 col-sm-10">
                                            <button type="submit" className="btn btn-default btn-auth">Send reset
                                                password link
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </main>
                    </div>
                </div>
                /*jshint ignore:end */
            );
        } else {
            return (
                /*jshint ignore:start */
                <div className="outer">
                    <div className="middle">
                        <main className="auth-main inner">
                            <div className="auth-block">
                                    <div className="form-group">
                                        Please check mail on {this.props.email} address.
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-offset-10 col-sm-10">
                                            <a href="/" className="btn btn-default">Home</a>
                                        </div>
                                    </div>
                            </div>
                        </main>
                    </div>
                </div>
                /*jshint ignore:end */
            );
        }
    }
};

export default ResetPasswordLinkForm;