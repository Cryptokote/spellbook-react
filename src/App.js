import React from 'react';
import {schools, sources} from './constants';
import { Multiselect } from 'react-widgets';
import Api from './api';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect
} from 'react-router-dom'

const spellLvl = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

class Table extends React.Component {
    api = new Api();
    constructor() {
        super();
        this.state = {
            unsortedData: [],
            activeClass: 'wizard',
            data: [],
            show: [],
            search: '',
            loggedIn: window.localStorage.getItem('token'),
            showNotification: false,
            notificationMessage: '',
            favorites: [],
            favClass: 'wizard',
            userName: '',
            filters: {
                spellLvl: [0],
                school: [],
                source: []
            }
        };

        this.api.getClassSpells('wizard').then((spells) => {
            this.setState({unsortedData: spells.data.data}, this.filter);
        });
        if (this.state.loggedIn) {
            this.api.getFavorites().then((favorites) => {
                this.setState({favorites: favorites.data.data});
            });
            this.api.getUserData().then((userData) => {
                this.setState({userName: userData.data.data.username});
            })
        }
    }
    updateSearch(evt) {
        this.setState({
            search: evt.target.value
        });
    }
    filter() {
        const unsorted = [...this.state.unsortedData];
        if (this.state.filters.spellLvl.length === 0
            && this.state.filters.school.length === 0
            && this.state.filters.source.length === 0
            && this.state.search.length === 0
        ) {
            this.setState({data: unsorted})
        } else {
            const lvlClass = this.state.activeClass === 'spellbook'
                ? this.state.favClass
                : this.state.activeClass;
            let filtered = unsorted
                .filter(item => this.state.filters.spellLvl.length === 0
                    || this.state.filters.spellLvl.includes(item.lvl[lvlClass]))
                .filter(item => this.state.filters.school.length === 0 || this.state.filters.school.includes(item.school))
                .filter(item => this.state.filters.source.length === 0 || this.state.filters.source.includes(item.source))
                .filter(item => this.state.search.length === 0 || item.name.includes(this.state.search));
            this.setState({data: filtered});
        }
    }
    withoutBrackets(item) {
        return item.split('(')[0];
    }
    getShowClass(name) {
        const className = 'spell-more';
        return this.state.show.includes(name) ? className : `${className} hidden`;
    }
    showHide(name) {
        let newShowArray = [];
        if (this.state.show.includes(name)) {
            newShowArray = this.state.show.filter(item => item !== name);
        } else {
            newShowArray = [...this.state.show, name];
        }
        this.setState({show: newShowArray});
    }
    getResistClass(prop) {
        const className = 'resist cell';
        return prop.includes('Yes') ? `${className} text-success` : `${className} text-danger`;
    }
    getPlayerClass(prop) {
        const baseClass = 'player-class';
        return prop === this.state.activeClass ? `${baseClass} active` : baseClass;
    }
    changePlayerClass(prop) {
        this.api.getClassSpells(prop).then((spells) => {
            if (prop !== this.state.activeClass) {
                this.setState({activeClass: prop, unsortedData: spells.data.data, favClass: prop}, this.filter);
            }
        });
    }
    showSpellbook() {
        const currClass = this.state.activeClass;
        if (currClass !== 'spellbook') {
            this.setState({
                activeClass: 'spellbook',
                unsortedData: [...this.state.favorites],
                favClass: currClass
            }, this.filter);
        }
    }


    addToFavorite(item) {
        if (!this.state.loggedIn) {
            this.setState({showNotification: true, notificationMessage: 'You need to be logged in to edit favorites!'});
            setTimeout(() => {
                this.setState({showNotification: false, notificationMessage: ''});
            }, 4000);
        } else {
            if (!!(this.state.favorites.find(i => i._id === item._id))) {
                this.api.removeFavorite(item._id).then((response) => {
                    if (response.data.status) {
                        let favoritesWithoutItem = this.state.favorites.filter(i => i._id !== item._id);
                        this.setState({favorites: favoritesWithoutItem});
                    }
                });
            } else {
                this.api.addFavorite(item._id).then((response) => {
                    if (response.data.status) {
                        this.setState({favorites: [...this.state.favorites, item]});
                    }
                });
            }
        }
    }
    spellLvl(item) {
        const lvlClass = this.state.activeClass === 'spellbook'
            ? this.state.favClass
            : this.state.activeClass;
        return item.lvl[lvlClass];
    }
    getNotificationClass() {
        const notificationShow = this.state.showNotification ? 'shown' : '';
        return `notification text-center ${notificationShow}`;
    }
    getFavoriteClass(item) {
        const isFav = !!(this.state.favorites.find(i => i._id === item._id)) ? 'active' : '';
        return `fa fa-star favorite ${isFav}`;
    }
    login() {
        this.api.login().then((response) => {
            window.localStorage.setItem('token', response.data.data);
            this.api.getFavorites().then((favorites) => {
                this.setState({loggedIn: response.data.data, favorites: favorites.data.data});
            });
        });
    }
    logout() {
        this.api.logout().then((response) => {
            window.localStorage.setItem('token', '');
            this.setState({loggedIn: false, favorites: []});
            if (this.state.activeClass === 'spellbook') {
                this.changePlayerClass('wizard');
            }
        });
    }
    render () {
        const isLoggedIn = this.state.loggedIn;

        let loginButton = null;
        let spellBookButton = null;
        if (isLoggedIn) {
            loginButton =
                <button className="btn btn-link login" onClick={() => this.logout()}>
                    Welcome, {this.state.userName}! (Logout)
                </button>;
                spellBookButton =
                    <div className="class-wrapper">
                        <div className={this.getPlayerClass('spellbook')}
                             onClick={() =>this.showSpellbook()}>
                            <div className="spellbook image"></div>
                        </div>
                        <span className="class-title">
                                    Spellbook ({this.state.favClass[0]})
                        </span>
                    </div>
        } else {
            loginButton =
                <button className="btn btn-link login">
                    <Link to='/login'>Login/Register</Link>
                </button>;
        }
        return (
            <div>
                <div className="filters col-md-12">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="class-wrapper">
                                <div className={this.getPlayerClass('cleric')}
                                     onClick={()=>this.changePlayerClass('cleric')}>
                                    <div className="cleric image"></div>
                                </div>
                                <span className="class-title">
                                Cleric
                            </span>
                            </div>
                            <div className="class-wrapper">
                                <div className={this.getPlayerClass('wizard')}
                                     onClick={()=>this.changePlayerClass('wizard')}>
                                    <div className="wizard image"></div>
                                </div>
                                <span className="class-title">
                                    Wizard
                                </span>
                            </div>

                            {spellBookButton}
                            {loginButton}

                        </div>

                        <div className="col-md-2 form-group">
                            <label>
                                Lvl
                            </label>
                            <Multiselect
                                data={spellLvl}
                                onChange={(value, metadata) => {this.state.filters.spellLvl = value;}}
                                defaultValue={['0']}
                            />
                        </div>
                        <div className="col-md-2 form-group">
                            <label>
                                Name
                            </label>
                            <input type="text" className="form-control" onChange={evt => this.updateSearch(evt)}/>
                        </div>
                        <div className="col-md-3 form-group">
                            <label>
                                School
                            </label>
                            <Multiselect
                                data={schools}
                                onChange={(value, metadata) => {this.state.filters.school = value;}}
                            />
                        </div>
                        <div className="col-md-3 form-group">
                            <label>
                                Source
                            </label>
                            <Multiselect
                                data={sources}
                                onChange={(value, metadata) => {this.state.filters.source = value;}}
                            />
                        </div>
                        <div className="col-md-2 form-group">
                            <button onClick={()=>this.filter()} className="btn btn-success filter">
                                <i className="fa fa-filter"></i> Filter
                            </button>
                        </div>

                    </div>
                </div>
                <div className="spell-content wrapper">

                    <SpellsHeader/>

                        {this.state.data.map((item) =>
                            <div key={`${item.name}-${item.source}`} className="spell">
                                <div className="spell-content" onClick={() => this.showHide(item.name)}>
                                    <div className="lvl lvl-content cell">
                                        <small>{this.spellLvl(item)}</small>
                                        <i className={this.getFavoriteClass(item)} onClick={() => this.addToFavorite(item)}></i>
                                    </div>
                                    <div className="name cell">
                                        <a href={item.link} target="_blank">{item.name}</a> <br/>
                                        <small>
                                            ({item.school},{item.components})
                                        </small>
                                    </div>
                                    <div className="range cell">{this.withoutBrackets(item.range)}</div>
                                    <div className="duration cell">{item.duration}</div>
                                    <div className="target cell">{item.target}</div>
                                    <div className="saveThrow cell">{this.withoutBrackets(item.savingThrow)}</div>
                                    <div className={this.getResistClass(item.spellResist)}>{this.withoutBrackets(item.spellResist)}</div>
                                </div>
                                <div className={this.getShowClass(item.name)}>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <span className="section-header">
                                                Range
                                            </span><br/>
                                            {item.range}
                                        </div>
                                        <div className="col-md-3">
                                            <span className="section-header">
                                                Duration
                                            </span><br/>
                                            {item.duration}
                                        </div>
                                        <div className="col-md-3">
                                            <span className="section-header">
                                                Target
                                            </span><br/>
                                            {item.target}
                                        </div>
                                        <div className="col-md-3">
                                            <span className="section-header">
                                                Save
                                            </span><br/>
                                            {item.savingThrow}
                                        </div>
                                        <div className="col-md-3">
                                            <span className="section-header">
                                                Spell resist
                                            </span><br/>
                                            {item.spellResist}
                                        </div>
                                        <div className="col-md-3">
                                            <span className="section-header">
                                                Cast time
                                            </span><br/>
                                            {item.castTime}
                                        </div>
                                        <div className="col-md-3">
                                            <span className="section-header">
                                                Area
                                            </span><br/>
                                            {item.area}
                                        </div>
                                        <div className="col-md-3">
                                            <span className="section-header">
                                                Source book
                                            </span><br/>
                                            {item.source}
                                        </div>
                                    </div>
                                    <div className="bordered-top">
                                        {item.description}
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
                <div className={this.getNotificationClass()}>
                    <h2>
                        {this.state.notificationMessage}
                    </h2>
                </div>
            </div>
        )
    }
}

const SpellsHeader = () => (
    <div className="header-wrapper">
        <div className="lvl header">
            Lvl
        </div>
        <div className="name header">
            Name
        </div>
        <div className="range header">
            Range
        </div>
        <div className="duration header">
            Duration
        </div>
        <div className="target header">
            Target
        </div>
        <div className="saveThrow header">
            Save
        </div>
        <div className="resist header">
            Resist
        </div>
    </div>
);
class LoginRegister extends React.Component {
    api = new Api();
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

class App extends React.Component {
    constructor() {
        super();
    }
    render () {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Table}/>
                    <Route path="/login" component={LoginRegister}/>
                </div>
            </Router>
        )
    }
}
export default App