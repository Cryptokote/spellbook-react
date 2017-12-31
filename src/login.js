import React from 'react';
import apiService from './api';

import {
    Redirect
} from 'react-router-dom'

class LoginRegister extends React.Component {
    api = apiService;
    constructor(){
        super();
        this.state = {
            formType: 'login',
            password: '',
            userName: '',
            email: '',
            redirect: false
        }
    }
    updateInput(stateName, value) {
        this.state[stateName] = value.target.value;
    }
    login() {
        if (this.state.email && this.state.password){
            this.api.login(this.state.email, this.state.password).then((response) => {
                if (response.data.status) {
                    window.localStorage.setItem('token', response.data.data);
                    this.setState({redirect: true});
                } else {
                    alert(response.data.data);
                }
            }).catch((error) => {
                alert(error);
            });
        }
    }
    register() {
        if (this.state.email && this.state.password && this.state.userName){
            this.api.register(this.state.email, this.state.password, this.state.userName).then((response) => {
                if (response.data.status) {
                    alert('Registration complete successfully!')
                    // window.localStorage.setItem('token', response.data.data);
                    this.setState({formType: 'login'});
                } else {
                    alert(response.data.data);
                }
            }).catch((error) => {
                alert(error);
            });
        }
    }
    render (){
        let loginOrRegister = null;
        if (this.state.formType === 'login') {
            loginOrRegister =
                <div>
                    <div className="form-group">
                        <button className="btn btn-success" onClick={() => this.login()}>
                            Login
                        </button>
                    </div>
                    <button className="btn btn-link" onClick={() => this.setState({formType: 'register'})}>
                        Register
                    </button>
                </div>
        } else {
            loginOrRegister =
                <div>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="User name" onChange={evt => this.updateInput('userName', evt)}/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-success" onClick={() => this.register()}>
                            Register
                        </button>
                    </div>
                    <button className="btn btn-link" onClick={() => this.setState({formType: 'login'})}>
                        Back to login
                    </button>
                </div>
        }
        if (this.state.redirect) {
            return <Redirect to='/'/>;
        } else {
            return (
                <div>
                    <div className="login-form">
                        <div className="player-class spellbook active"></div>
                        <h2>Welcome to SpellbookApp!</h2>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="E-mail"
                                   onChange={evt => this.updateInput('email', evt)}/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Password"
                                   onChange={evt => this.updateInput('password', evt)}/>
                        </div>
                        {loginOrRegister}
                    </div>
                </div>
            )
        }
    }
}

export default LoginRegister;