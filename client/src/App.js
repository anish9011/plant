import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Signin from './Components/Signin';
import Signup from './Components/Signup';
import Home from './Components/Home';
const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Signin} />
        <Route path="/signup" component={Signup} />
        <Route path="/home" component={Home}/>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
