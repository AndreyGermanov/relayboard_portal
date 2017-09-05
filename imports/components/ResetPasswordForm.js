import React,{Component} from 'react';

const ResetPasswordForm = class extends Component {
    render() {
        var fields = {
            password: {
                has_error_class: '',
                placeholder: 'Password'
            },
            confirm_password: {
                has_error_class: '',
                placeholder: 'Confirm password'
            },
            general: {
                message: ''
            }
        };
        if (typeof(this.props.errors['password'])!='undefined' && this.props.errors['password']) {
            fields['password'] = {
                has_error_class: 'has-error',
                placeholder: this.props.errors['password']
            };
        }
        if (typeof(this.props.errors['confirm_password'])!='undefined' && this.props.errors['confirm_password']) {
            fields['confirm_password'] = {
                has_error_class: 'has-error',
                placeholder: this.props.errors['confirm_password']
            };
        }
        if (typeof(this.props.errors['general'])!='undefined' && this.props.errors['general']) {
            fields['general'] = {
                message: this.props.errors['general']
            }
        }
        return (
            <div className="outer">
                <div className="middle">
                    <main className="auth-main inner">
                        <div className="auth-block">
                            <h1>Enter New Password</h1>
                            <div className="alert bg-danger"
                                 style={{display:(fields['general'].message.length ? '':'none')}}>{fields['general'].message}</div>
                            <form className="form-horizontal" onSubmit={this.props.onFormSubmit}>
                                <div className={"form-group "+fields['password'].has_error_class}>
                                    <label htmlFor="password" className="col-sm-2 control-label">Password</label>
                                    <div className="col-sm-10">
                                        <div className="input-group">
                                            <span
                                                className="input-group-addon input-group-addon-primary addon-left">
                                                <i className="fa fa-lock"></i>
                                            </span>
                                            <input type="password" id="password" className='form-control'
                                                   placeholder={fields['password'].placeholder}
                                                   value={this.props.password}
                                                   onChange={this.props.onChangePasswordField}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={"form-group "+fields['confirm_password'].has_error_class}>
                                    <label htmlFor="confirm_password" className="col-sm-2 control-label">Confirm</label>
                                    <div className="col-sm-10">
                                        <div className="input-group">
                                            <span
                                                className="input-group-addon input-group-addon-primary addon-left">
                                                <i className="fa fa-lock"></i>
                                            </span>
                                            <input type="password" id="confirm_password" className='form-control'
                                                   placeholder={fields['confirm_password'].placeholder}
                                                   value={this.props.confirm_password}
                                                   onChange={this.props.onChangeConfirmPasswordField}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-offset-2 col-sm-10">
                                        <button type="submit" className="btn btn-default btn-auth">Reset password</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        )

    }
};

export default ResetPasswordForm;