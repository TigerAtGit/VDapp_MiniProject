import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Router, Switch, Route } from 'react-router-dom';
import history from './history';

ReactDOM.render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={App} />
        </Switch>
    </Router>,
    document.getElementById('root')
);
