import React from 'react';
import Table from './table';
import AppHeader from './appHeader';


class SpellList extends React.Component {
    render() {
        return (
            <div>
                <AppHeader/>
                <Table dataMode="spells"/>
            </div>
        );
    }
}
export default SpellList;