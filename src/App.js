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
            filters: {
                spellLvl: [0],
                school: [],
                source: []
            }
        };

        this.api.login().then((response) => {
            window.localStorage.setItem('token', response.data.data);
            this.api.getClassSpells('wizard').then((spells) => {
                this.setState({unsortedData: spells.data.data}, this.filter);
            });
        })
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
            let filtered = unsorted
                .filter(item => this.state.filters.spellLvl.length === 0
                    || this.state.filters.spellLvl.includes(item.lvl[this.state.activeClass]))
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
                this.setState({activeClass: prop, unsortedData: spells.data.data}, this.filter);
            }
        });
    }
    render () {
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

                    {this.state.data.map((item) =>
                        <div key={`${item.name}-${item.source}`} className="spell">
                            <div className="spell-content" onClick={() => this.showHide(item.name)}>
                                <div className="lvl lvl-content cell"><small>{item.lvl[this.state.activeClass]}</small></div>
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
            </div>
        )
    }
}

const Mock = () => (
    <div>
        <h1>Mock</h1>
    </div>
);

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            loggedIn: window.localStorage.getItem('token')
        };
        console.log(this.state.loggedIn);
    }

    render () {
        return (
            <Router>
                {/*<Route path="/about" component={About}/>*/}
                <Route path="/" render={() => (
                    this.state.loggedIn ? (
                        <Table />
                    ) : (
                        <Mock />
                    )
                )}/>
            </Router>
        )
    }
}
export default App