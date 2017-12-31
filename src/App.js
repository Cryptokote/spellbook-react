import React from 'react';
import SpellList from './spellList';
import SpellBook from './spellBook';
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
                    <Route exact path="/" component={SpellList}/>
                    <Route path="/spellbook" component={SpellBook}/>
                    <Route path="/login" component={LoginRegister}/>
                </div>
            </Router>
        )
    }
}
export default App