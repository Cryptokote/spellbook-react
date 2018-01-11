import React from 'react';
import apiService from './api';
import { DropdownList } from 'react-widgets'

class UserCollection extends React.Component {
    api = apiService;
    constructor(props) {
        super(props);
        this.state = {
            collections: [],
            currentCollection: '',
            popupShowed: false,
            popupBody: '',
            newCollection: ''
        };
        this.api.getUserData().then(response => {
            this.setState({
                collections: ['favorites', ...response.data.data.collections],
                currentCollection: this.props.collectionName
            });
        });
    }
    onChange(value) {
        this.setState({currentCollection: value});
        this.props.onCollectionChange(value);
    }
    deleteCollectionClass() {
        const disabled = this.state.currentCollection === 'favorites' ? ' disabled' : '';
        return `btn btn-danger collections-btn${disabled}`;
    }
    showPopup(popupBody) {
        this.setState({popupBody, popupShowed: true});
    }
    hidePopup() {
        this.setState({popupShowed: false});
    }
    updateNewCollName(evt) {
        this.setState({
            newCollection: evt.target.value
        });
    }
    addCollection() {
        this.api.createCollection(this.state.newCollection).then((resp) => {
           if (resp.data.status) {
               this.setState({collections: [...this.state.collections, resp.data.data]})
           }
        });
        this.hidePopup();
    }
    deleteCollection() {
        this.api.deleteCollection(this.state.currentCollection).then((resp) => {
            if (resp.data.status) {
                this.setState({
                    collections: [...this.state.collections.filter(item => item !== resp.data.data)],
                }, this.onChange('favorites'));
            }
        });
        this.hidePopup();
    }
    render() {
        let dropdownList;
        if (!this.state.currentCollection) {
            dropdownList =
                <DropdownList busy/>
        } else {
            dropdownList =
                <div className="collectionsDropdown">
                    <DropdownList
                        data={this.state.collections}
                        onChange={value => this.onChange(value)}
                        value={this.state.currentCollection}
                        defaultValue={[this.state.collections[0]]}
                    />
                </div>

        }
        const popupBgClass = this.state.popupShowed ? 'popupBg' : 'popupBg hide';
        const addCollectionBody =
            <div className="popupBody">
                <h2>Create new collection</h2>
                <div className="form-group col-md-12">
                        <input type="text" className="form-control" placeholder="New collection name"
                               onChange={evt => this.updateNewCollName(evt)}/>
                </div>
                <div className="form-group col-md-12 popupActions">
                    <button className="btn btn-warning collections-btn" onClick={() => this.hidePopup()}>Cancel</button>
                    <button className="btn btn-success collections-btn" onClick={() => this.addCollection()}>Add</button>
                </div>
            </div>
        ;
        const deleteCollectionBody =
            <div className="popupBody">
                <h2>Delete collection: {this.state.currentCollection} ?</h2>
                <div className="form-group col-md-12 popupActions">
                    <button className="btn btn-warning collections-btn" onClick={() => this.hidePopup()}>Cancel</button>
                    <button className="btn btn-danger collections-btn" onClick={() => this.deleteCollection()}>Delete</button>
                </div>
            </div>
        ;

        return (
            <div>
                <div className="col-md-12 classes-filter filters-bg collections-controls">
                    Collection: {dropdownList}
                    <button className={this.deleteCollectionClass()}
                            onClick={() => this.state.currentCollection === 'favorites' ? null : this.showPopup(deleteCollectionBody)}>
                        <i className="fa fa-trash"></i> Delete collection
                    </button>
                    <button className="btn btn-success collections-btn" onClick={() => this.showPopup(addCollectionBody)}>
                        <i className="fa fa-plus"></i> Add new collection
                    </button>
                </div>
                <div className={popupBgClass}>
                    {this.state.popupBody}
                </div>
            </div>
        );
    }
}
export default UserCollection;