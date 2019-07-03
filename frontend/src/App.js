import React from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './component/Navbar'
import AppBar from './component/MyAppBar'
import Login from './component/Login'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import Signup from './component/Signup'


export class App extends React.Component {
  render() {
    return ( 
      <Router >
        <AppBar isLoggedIn="false"/>
      <Redirect to="/login"/>  
      <Route path="/signup" component={Signup}/>
      <Route path="/login" component={Login}/> 
    </Router>
    );
  }
}

export default App;
