import React from 'react';
import {clericData} from './cleric.data';
import {wizardData} from './wizard.data'
import {schools, sources} from './constants';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Multiselect } from 'react-widgets';


const spellLvl = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];


class Table extends React.Component {
    constructor() {
        super();
        this.state = {
            unsortedData: wizardData,
            activeClass: 'wizard',
            isRandom: false,
            randomCount: 0,
            data: wizardData.filter(item => item.lvl === '0'),
            show: [],
            spellbook: [],
            search: '',
            filters: {
                spellLvl: ['0'],
                school: [],
                source: []
            }
        };
    }
    updateSearch(evt) {
        this.setState({
            search: evt.target.value
        });
    }
    filter() {
        if (!this.state.unsortedData) {
            this.setState({data: []});
            return
        }
        const unsorted = [...this.state.unsortedData];
        if (this.state.filters.spellLvl.length === 0
            && this.state.filters.school.length === 0
            && this.state.filters.source.length === 0
            && this.state.search.length === 0
        ) {
            this.setState({data: unsorted})
        } else {
            let filtered = unsorted
                .filter(item => this.state.filters.spellLvl.length === 0 || this.state.filters.spellLvl.includes(item.lvl))
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
        let data;
        switch(prop) {
            case 'wizard':
                data = wizardData;
                break;
            case 'cleric':
                data = clericData;
                break;
            // case 'spellbook':
            //     data = [];
            //     break;
        }
        if (prop !== this.state.activeClass) {
            this.setState({activeClass: prop, unsortedData: data, isRandom: false}, this.filter);
        } else if (this.state.isRandom) {
            this.setState({unsortedData: data, isRandom: false}, this.filter);
        }
    }
    getRandomSpells() {
        if (!this.state.isRandom) {
            const unsorted = [...this.state.data];
            const count = this.state.randomCount;
            let randomData = [];
            for (let i = 0; i < count; i++) {
                let index = Math.floor(Math.random() * unsorted.length);
                randomData.push(unsorted[index]);
                unsorted.splice(index, 1);
            }
            randomData.sort((a,b) => {return a.lvl - b.lvl});
            this.setState({isRandom: true, data: randomData});
        } else {
            this.setState({isRandom: false}, this.filter);
        }
    }
    updateRandomCount(evt) {
        this.setState({
            randomCount: evt.target.value
        });
    }
    getRandomClass() {
        const baseClass = 'player-class';
        return this.state.isRandom ? `${baseClass} active` : baseClass;
    }
    render () {
        return (
            <div>

            <div className="filters col-md-12">
                <div className="row">
                <div className="col-md-3 form-group">
                    <label>
                        Lvl
                    </label>
                    <Multiselect
                        data={spellLvl}
                        onChange={(value, metadata) => {this.state.filters.spellLvl = value;}}
                        defaultValue={['0']}
                    />
                </div>
                <div className="col-md-3 form-group">
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
                <div className="col-md-12 text-center">
                    <div className="class-wrapper left form-inline">
                        <div className={this.getRandomClass()}
                             onClick={()=>this.getRandomSpells()}>
                            <div className="spellbook image"></div>
                        </div>
                        <span className="class-title">
                            Get random!
                        </span>
                    </div>
                    <div className="counter-wrapper">
                        <input type="text" className="form-control" onChange={evt => this.updateRandomCount(evt)}/>
                    </div>
                    <div className="class-wrapper">
                        <div className={this.getPlayerClass('cleric')}
                             onClick={()=>this.changePlayerClass('cleric')}>
                            <div className="cleric image"></div>
                        </div>
                        <span className="class-title">
                            Cleric
                        </span>
                    </div>
                    <button onClick={()=>this.filter()} className="btn btn-success filter">
                        Filter
                    </button>
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
                                <div className="lvl lvl-content cell">
                                    <small>{item.lvl}</small>
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
                                    <div className="col-md-3 col-sm-6">
                                        <span className="section-header">
                                            Range
                                        </span>
                                        {item.range}
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <span className="section-header">
                                            Duration
                                        </span>
                                        {item.duration}
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <span className="section-header">
                                            Target
                                        </span>
                                        {item.target}
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <span className="section-header">
                                            Save
                                        </span>
                                        {item.savingThrow}
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <span className="section-header">
                                            Spell resist
                                        </span>
                                        {item.spellResist}
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <span className="section-header">
                                            Cast time
                                        </span>
                                        {item.castTime}
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <span className="section-header">
                                            Area
                                        </span>
                                        {item.area}
                                    </div>
                                    <div className="col-md-3 col-sm-6">
                                        <span className="section-header">
                                            Source book
                                        </span>
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
export default Table