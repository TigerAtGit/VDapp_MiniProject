import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './components/Home';

import { Router, Switch, Route } from 'react-router-dom';
import history from './history';

ReactDOM.render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={Home} />
        </Switch>
    </Router>,
    document.getElementById('root')
);
