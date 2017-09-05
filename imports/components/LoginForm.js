import React,{Component} from 'react';

const LoginForm = class extends Component {
    render() {
        var fields = {
            email: {
                has_error_class: '',
                placeholder: 'email'
            },
            password: {
                has_error_class: '',
                placeholder: 'password'
            },
            general: {
                message: ''
            }
        };
        if (typeof(this.props.errors['email'])!='undefined' && this.props.errors['email']) {
            fields['email'] = {
                has_error_class: 'has-error',
                placeholder: this.props.errors['email']
            };
        }
        if (typeof(this.props.errors['password'])!='undefined' && this.props.errors['password']) {
            fields['password'] = {
                has_error_class: 'has-error',
                placeholder: this.props.errors['password']
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
                            <h1>Sign in to RelayBoard Portal</h1>
                            <div className="alert bg-danger" style={{display:(fields['general'].message.length ? '':'none')}}>{fields['general'].message}</div>
                            <form className="form-horizontal" onSubmit={this.props.onFormSubmit}>
                                <div className={"form-group "+fields['email'].has_error_class}>
                                    <label htmlFor="email" className="col-sm-2 control-label">Email</label>
                                    <div className="col-sm-10">
                                        <div className="input-group">
                                            <span className="input-group-addon input-group-addon-primary addon-left">
                                                <i className="fa fa-user"></i>
                                            </span>
                                            <input type="email" id="email" className='form-control'  placeholder={fields['email'].placeholder} value={this.props.email} onChange={this.props.onChangeEmailField}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={"form-group "+fields['password'].has_error_class}>
                                    <label htmlFor="password" className="col-sm-2 control-label">Password</label>

                                    <div className="col-sm-10">
                                        <div className="input-group">
                                            <span className="input-group-addon input-group-addon-primary addon-left">
                                                <i className="fa fa-lock"></i>
                                            </span>
                                            <input type="password" id='password' className="form-control" placeholder={fields['password'].placeholder} value={this.props.password} onChange={this.props.onChangePasswordField}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-offset-2 col-sm-10">
                                        <button type="submit" className="btn btn-default btn-auth">Sign in</button>
                                        <a href="/link" className="forgot-pass">Forgot password?</a>
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

export default LoginForm;