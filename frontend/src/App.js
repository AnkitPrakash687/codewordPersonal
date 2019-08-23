import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './component/Navbar'
import AppBar from './component/MyAppBar'
import Login from './component/Login'
import Dashboard from './component/Dashboard'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import Signup from './component/Signup'


export default function App()  {

    const [state, setState] = useState({
      loggedIn:false
    })
    return ( 
      <Router >
        <AppBar isLoggedIn={state.loggedIn}/>
      <Redirect to="/login"/>  
      <Route path="/signup" component={Signup}/>
      <Route path="/login" component={Login}/> 
      <Route path="/dashboard" render={(props) => <Dashboard {...props} />}></Route>
    </Router>
    ); 
}

//export default App;
