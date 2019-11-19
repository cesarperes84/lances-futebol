import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import './css/bootstrap.css';
import './index.css';

import InsertView from './view/InsertView';
import ListView from './view/ListView';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ListView} />
        <Route exact path="/insert" component={InsertView} />
      </Switch>
    </Router>
  );
}

export default App;
