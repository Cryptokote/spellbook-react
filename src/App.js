import React from 'react';
import Table from './table';
import LoginRegister from './login';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom'

class App extends React.Component {
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