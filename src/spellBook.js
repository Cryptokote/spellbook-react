import React from 'react';
import Table from './table';
import AppHeader from './appHeader';
import UserCollection from './userCollections';


class SpellBook extends React.Component {
    constructor() {
        super();
        this.state = {
            collection: 'favorites'
        };
        this.changeCollection = this.changeCollection.bind(this);
    }

    changeCollection(collection) {
        console.log('change collection', collection);
        this.setState({collection: collection});
    }

    render() {
        return (
            <div>
                <AppHeader/>
                <UserCollection collectionName={this.state.collection}
                                onCollectionChange={this.changeCollection}/>
                <Table dataMode="favorites" collectionName={this.state.collection}/>
            </div>
        );
    }
}
export default SpellBook;