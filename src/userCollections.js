import React from 'react';
import apiService from './api';
import { DropdownList } from 'react-widgets'

class UserCollection extends React.Component {
    api = apiService;
    constructor(props) {
        super(props);
        this.state = {
            collections: [],
            currentCollection: ''
        };
        this.api.getUserData().then(response => {
            this.setState({
                collections: ['favorites', ...response.data.data.collections],
                currentCollection: this.props.collectionName
            });
        });
    }
    onChange(value) {
        console.log(value);
    }
    render() {
        let dropdownList;
        if (!this.state.currentCollection) {
            console.log('zazaza');
            dropdownList =
                <DropdownList busy/>
        } else {
            dropdownList =
                <DropdownList
                    data={this.state.collections}
                    onChange={value => this.onChange(value)}
                    defaultValue={[this.state.collections[0]]}
                />
        }

        return (
            <div className="col-md-12">
                {dropdownList}
            </div>
        );
    }
}
export default UserCollection;