import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import Homepage from './components/Homepage';
import AddCandidate from './components/AddCandidate';
import Candidates from './components/Candidates';
import VerifyVoter from './components/VerifyVoter';
import Results from './components/Results';
import Phase from './components/Phase';
import Voting from './components/Voting';

ReactDOM.render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={Homepage} />
            <Route path='/AddCandidate' component={AddCandidate} />
            <Route path='/CandidateDetails' component={Candidates} />
            <Route path='/VerifyVoter' component={VerifyVoter} />
            <Route path='/Result' component={Results} />
            <Route path='/Phase' component={Phase} />
            <Route path='/Vote' component={Voting} />
        </Switch>
    </Router>,
    document.getElementById('root')
);
