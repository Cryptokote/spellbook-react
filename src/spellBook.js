import React from 'react';
import Table from './table';
import AppHeader from './appHeader';
import UserCollection from './userCollections';


class SpellBook extends React.Component {
    constructor() {
        super();
        this.state = {
            collection: 'favorites'
        }
    }

    changeCollection(collection) {
        this.setState({collection: collection});
    }

    render() {
        return (
            <div>
                <AppHeader/>
                <UserCollection collectionName={this.state.collection}/>
                <Table dataMode="favorites" collectionName={this.state.collection}/>
            </div>
        );
    }
}
export default SpellBook;