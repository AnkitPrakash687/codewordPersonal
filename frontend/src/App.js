import React, { useState, Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './component/Navbar'
import AppBar from './component/MyAppBar'
import Login from './component/Login'
import Dashboard from './component/Dashboard'
import Course from './component/instructor/Course'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import Signup from './component/Signup'
//import history from './helper/history'
import PrivateRoute from './component/PrivateRoute'

class App extends Component {

 constructor(props){
   super(props)
 
 }

 
  render(){
  
  return (
    <Router >
        <PrivateRoute exact path="/" component={Dashboard} />
        <PrivateRoute exact path="/course/:id" component={Course} />
        <Route path="/signin" component={Login} />
        <Route path="/signup" component={Signup} />
    </Router>
  );
}
}
export default App;
