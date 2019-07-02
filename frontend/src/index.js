import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Signup from './component/Signup'
import NavBar from './component/Navbar'
import Login from './component/Login'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import * as serviceWorker from './serviceWorker';

ReactDOM.render((
    <Router>
       <div>
       <NavBar />          
      <Route path="/" component={App}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/login" component={Login}/> 
    </div>
    </Router>
  ), document.getElementById('root'))

  
//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
