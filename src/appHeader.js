import React from 'react';
import { NavLink, Link } from 'react-router-dom'
import apiService from './api';


class AppHeader extends React.Component {
    api = apiService;
    constructor() {
        super();
        this.state = {
            loggedIn: window.localStorage.getItem('token'),
            useName: ''
        };
        if (this.state.loggedIn) {
            this.api.getUserData().then((userData) => {
                this.setState({userName: userData.data.data.username});
            })
        }
    }
    logout() {
        this.api.logout().then((response) => {
            window.localStorage.setItem('token', '');
            this.setState({loggedIn: false});
            if (this.state.activeClass === 'spellbook') {
                this.changePlayerClass('wizard');
            }
        });
    }
    render() {
        const isLoggedIn = this.state.loggedIn;
        let loginButton = null;
        let loggedInSection = null;
        if (isLoggedIn) {
            loginButton =
                <button className="btn btn-link login" onClick={() => this.logout()}>
                    Welcome, {this.state.userName}! (Logout)
                </button>;
            loggedInSection =
                <button className="btn btn-link">
                    <NavLink to="/spellbook">SpellBook</NavLink>
                </button>
        } else {
            loginButton =
                <button className="btn btn-link login">
                    <Link to='/login' className="active">Login/Register</Link>
                </button>;
        }

        return (
            <div className="app-header col-md-12">
                <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-link">
                            <NavLink exact to="/">SpellList</NavLink>
                        </button>
                        {loggedInSection}
                        {loginButton}
                    </div>
                </div>
            </div>
        );
    }
}

export default AppHeader