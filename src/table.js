import React from 'react';
import PropTypes from 'prop-types';
import {schools, sources} from './constants';
import { Multiselect, DropdownList } from 'react-widgets';
import apiService from './api';
import SpellsHeader from './spellheader';

const spellLvl = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

class Table extends React.Component {
    api = apiService;
    getUnsortedData;
    constructor(props) {
        super(props);
        const lsShowFilters = JSON.parse(window.localStorage.getItem('showFilters'));
        let filtersShown;
        if (lsShowFilters === null) {
            filtersShown = true;
            window.localStorage.setItem('showFilters', true);
        } else {
            filtersShown = lsShowFilters;
        }
        this.state = {
            unsortedData: [],
            activeClass: 'wizard',
            data: [],
            show: [],
            search: '',
            randomCount: '',
            showNotification: false,
            notificationMessage: '',
            favorites: [],
            filtersShown: filtersShown,
            filters: {
                spellLvl: [1],
                school: [],
                source: []
            },
            popupShowed: false,
            popupBody: '',
            currentSpellName: '',
            collections: [],
            addToCollection: ''
        };

        if (this.props.dataMode === 'spells') {
            this.getUnsortedData = this.api.getClassSpells(this.state.activeClass);
            this.api.getUserData().then(response => {
                this.setState({
                    collections: [...response.data.data.collections],
                    addToCollection: response.data.data.collections[0]
                });
            });
        }
        if (this.props.dataMode === 'favorites') {
            this.getUnsortedData = this.props.collectionName === 'favorites'
                ? this.api.getFavorites()
                : this.api.getCollection(this.props.collectionName);
        }

        this.update();


        if (window.localStorage.getItem('token')) {
            this.api.getFavorites().then((favorites) => {
                this.setState({favorites: favorites.data.data});
            });
        }
    }

    // on props enter
    componentWillReceiveProps(nextProps) {
        if (nextProps.collectionName && nextProps.dataMode === 'favorites') {
            this.getUnsortedData = nextProps.collectionName === 'favorites'
                ? this.api.getFavorites()
                : this.api.getCollection(nextProps.collectionName);
            this.update();
        }
    }

    // working with data
    update() {
        this.getUnsortedData.then((spells) => {
            this.setState({unsortedData: spells.data.data}, this.filter);
        });
    }
    filter() {
        const unsorted = [...this.state.unsortedData];
        const lvlClass = this.state.activeClass;
        let filtered = unsorted;
        if (this.state.filters.spellLvl.length > 0
            || this.state.filters.school.length > 0
            || this.state.filters.source.length > 0
            || this.state.search.length > 0
        ) {
            filtered = unsorted
                .filter(item => this.state.filters.spellLvl.length === 0
                    || this.state.filters.spellLvl.includes(item.lvl[lvlClass]))
                .filter(item => this.state.filters.school.length === 0 || this.state.filters.school.includes(item.school))
                .filter(item => this.state.filters.source.length === 0 || this.state.filters.source.includes(item.source))
                .filter(item => this.state.search.length === 0
                    || item.name.toLowerCase().includes(this.state.search.toLowerCase())
                    || item.description.toLowerCase().includes(this.state.search.toLowerCase()));
        }
        if (parseInt(this.state.randomCount) > 0) {
            filtered = this.getRandomFromList(filtered);
        }
        this.setState({data: filtered.filter(item => item.lvl[lvlClass] !== undefined)});

    }
    getRandomFromList(data) {
        const randomData = [];
        let randomCount = this.state.randomCount;
        while (randomCount > 0) {
            const iter = Math.floor(Math.random() * data.length);
            randomData.push(data[iter]);
            randomCount --;
        }
        return randomData;
    }
    changePlayerClass(prop) {
        if (prop !== this.state.activeClass){
            this.setState(
                {activeClass: prop},
                this.update()
            )
        }
    }
    addToFavorite(event, item) {
        if (!window.localStorage.getItem('token')) {
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
        event.stopPropagation()
    }

    // view classNames
    getResistClass(prop) {
        return prop.includes('Yes') ? 'text-success' : 'text-danger';
    }
    getPlayerClass(prop) {
        const baseClass = 'player-class';
        return prop === this.state.activeClass ? `${baseClass} active` : baseClass;
    }
    getFavoriteClass(item) {
        const isFav = !!(this.state.favorites.find(i => i._id === item._id)) ? 'active' : '';
        return `fa fa-star favorite ${isFav}`;
    }
    getCollectionClass() {
        let baseClass = 'fa favorite';
        if (this.props.dataMode === 'spells') {
            baseClass = `${baseClass} fa-floppy-o`;
        } else if (this.props.collectionName === 'favorites') {
            baseClass = `hidden`;
        } else {
            baseClass = `${baseClass} fa-times`;
        }
        return baseClass;

    }
    getShowHiddenClass(state) {
        return state ? 'show' : 'hide';
    }
    withoutBrackets(item) {
        return item.split('(')[0];
    }

    // inputs update
    updateRandomCount(evt) {
        this.setState({
            randomCount: evt.target.value
        });
    }
    updateSearch(evt) {
        this.setState({
            search: evt.target.value
        });
    }

    // trigering view states
    showHideMore(name) {
        let newShowArray = [];
        if (this.state.show.includes(name)) {
            newShowArray = this.state.show.filter(item => item !== name);
        } else {
            newShowArray = [...this.state.show, name];
        }
        this.setState({show: newShowArray});
    }
    triggerFiltersShow() {
        const shown = !this.state.filtersShown;
        this.setState({filtersShown: shown});
        window.localStorage.setItem('showFilters', shown);
    }
    // TODO: tmp method
    trimLink(link) {
        return link.replace('/dndtools', '');
    }
    //
    // popup copy-paste
    deleteFromCollection(id) {
        this.api.deleteFromCollection(this.props.collectionName, id).then((response) => {
            console.log(response);
        });
    }
    addToCollection(id) {
        this.api.addToCollection(this.state.addToCollection, id).then((response) => {
            console.log(response);
        });
        this.hidePopup();
    }
    updateDropdown(value) {
        this.setState({addToCollection: value})
    }
    showPopup(event, spell) {
        event.stopPropagation();
        const spellId = spell._id;
        const addToCollectionBody =
            <div className="popupBody">
                <h4>Add <b>{spell.name}</b> to collection</h4>
                <div className="form-group col-md-12">
                    <DropdownList
                        data={this.state.collections}
                        onChange={value => this.updateDropdown(value)}
                        defaultValue={[this.state.collections[0]]}
                    />
                </div>
                <div className="form-group col-md-12 popupActions">
                    <button className="btn btn-warning collections-btn" onClick={() => this.hidePopup()}>Cancel</button>
                    <button className="btn btn-success collections-btn" onClick={() => this.addToCollection(spellId)}>Add</button>
                </div>
            </div>
        ;
        const deleteFromCollectionBody =
            <div className="popupBody">
                <h4>Delete <b>{spell.name}</b> from <b>{this.props.collectionName}</b> ?</h4>
                <div className="form-group col-md-12 popupActions">
                    <button className="btn btn-warning collections-btn" onClick={() => this.hidePopup()}>Cancel</button>
                    <button className="btn btn-danger collections-btn" onClick={() => this.deleteFromCollection(spellId)}>Delete</button>
                </div>
            </div>
        ;

        const collectionPopupBody = this.props.dataMode === 'spells' ? addToCollectionBody : deleteFromCollectionBody;
        this.setState({popupBody: collectionPopupBody, popupShowed: true});
    }
    hidePopup() {
        this.setState({popupShowed: false});
    }

    render () {
        let random = null;
        if (this.props.dataMode === 'spells') {
            random =
                <div className="col-md-1 form-group">
                    <label>
                        Random
                    </label>
                    <input type="number" className="form-control" onChange={evt => this.updateRandomCount(evt)}/>
                </div>
        }

        // TODO: remove copy-paste
        const popupBgClass = this.state.popupShowed ? 'popupBg' : 'popupBg hide';

        // TODO: end

        return (
            <div>
                <div className="filters col-md-12">
                    <div className="row filters-bg classes-filter">
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
                    </div>
                    <div className={`row filters-bg ${this.getShowHiddenClass(this.state.filtersShown)}`}>
                        <div className="col-md-2 form-group">
                            <label>
                                Lvl
                            </label>
                            <Multiselect
                                data={spellLvl}
                                onChange={(value, metadata) => {this.state.filters.spellLvl = value;}}
                                defaultValue={this.state.filters.spellLvl}
                            />
                        </div>
                        <div className="col-md-3 form-group">
                            <label>
                                Name
                            </label>
                            <input type="text" className="form-control" onChange={evt => this.updateSearch(evt)}/>
                        </div>
                        <div className="col-md-2 form-group">
                            <label>
                                School
                            </label>
                            <Multiselect
                                data={schools}
                                onChange={(value, metadata) => {this.state.filters.school = value;}}
                            />
                        </div>
                        <div className="col-md-2 form-group">
                            <label>
                                Source
                            </label>
                            <Multiselect
                                data={sources}
                                onChange={(value, metadata) => {this.state.filters.source = value;}}
                            />
                        </div>
                            {random}
                        <div className="col-md-2 form-group">
                            <button onClick={()=>this.filter()} className="btn btn-success filter">
                                <i className="fa fa-filter"></i> Filter
                            </button>
                        </div>
                    </div>
                    <div className="filters-appendix" onClick={()=>this.triggerFiltersShow()}>
                        {this.getShowHiddenClass(!this.state.filtersShown)} filters
                    </div>
                </div>
                <div className="spell-content wrapper">
                    <SpellsHeader/>

                    {this.state.data.map((item) =>
                        <div key={`${item.name}-${item.source}`} className="spell">
                            <div className="spell-content" onClick={() => this.showHideMore(item.name)}>
                                <div className="lvl lvl-content cell">
                                    <small>{item.lvl[this.state.activeClass]}</small>
                                    <i className={this.getFavoriteClass(item)} onClick={(e) => this.addToFavorite(e, item)}></i>
                                    <i className={this.getCollectionClass()} onClick={(e) => this.showPopup(e, item)}></i>
                                </div>
                                <div className="name cell">
                                    <a href={this.trimLink(item.link)} target="_blank">{item.name}</a> <br/>
                                    <small>
                                        ({item.school},{item.components})
                                    </small>
                                </div>
                                <div className="range cell">{this.withoutBrackets(item.range)}</div>
                                <div className="duration cell">{item.duration}</div>
                                <div className="target cell">{item.target}</div>
                                <div className="saveThrow cell">{this.withoutBrackets(item.savingThrow)}</div>
                                <div className={`resist cell ${this.getResistClass(item.spellResist)}`}>{this.withoutBrackets(item.spellResist)}</div>
                            </div>
                            <div className={`spell-more ${this.getShowHiddenClass(this.state.show.includes(item.name))}`}>

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
                                        <span className={this.getResistClass(item.spellResist)}>
                                            {item.spellResist}
                                        </span>
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
                <div className={`notification text-center ${this.getShowHiddenClass(this.state.showNotification)}`}>
                    <h2>
                        {this.state.notificationMessage}
                    </h2>
                </div>
                <div className={popupBgClass}>
                    {this.state.popupBody}
                </div>
            </div>
        )
    }
}

Table.propTypes = {
    dataMode: PropTypes.string.isRequired,
    collectionName: PropTypes.string
};
export default Table;