import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { green, lightGreen, red } from '@material-ui/core/colors';
import {Redirect} from 'react-router-dom'
import history from '../history'
import API from '../utils/API'
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar:{
    background: green[500]
  },
  button:{
    margin: theme.spacing(1)
  }
}));

export default function MyAppBar(props) {
  const classes = useStyles();

  const [logout, setLogout] = useState(false)
  const [studentView, setStudentView] = useState(false)
  const [token, setToken] = useState(sessionStorage.getItem('token'))
  const [isInstructor, setIsInstructor] = useState(false)
  const [render, setRender] = useState(false)
  const handleLogout = () =>{
 
    sessionStorage.removeItem('token')
    setLogout(true)
  }

 const handleStudentView = () =>{
 
   setStudentView(true)
 }

 useEffect(()=>{

  console.log(token)
  if(token != null){
  const headers = {
    'token': token
  };

  API.get('dashboard/details', { headers: headers }).then(response => {
    console.log("me***********AppBAr")
    console.log(response.data)
   
          var user = response.data
          if(user.role == 'instructor'){
              setIsInstructor(true)
          }
        
        
    })
  }
  },[])
    
    if(logout){
      return <Redirect to="/"></Redirect>
    }else if(studentView){
      history.push('/studentview')
      return <Redirect to="/studentview"></Redirect>
    }
  

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
        
          <Typography variant="h6" className={classes.title}>
            CODEWORD
          </Typography>
          {token != null && isInstructor &&
          <Button 
          color="inherit"
          onClick={handleStudentView}
          className={classes.button}
          >
            Student View
          </Button>
          }
          {token != null &&
          <Button 
          color="inherit"
          className={classes.button}
          onClick={handleLogout}
          >
            Logout
          </Button>
          }
        </Toolbar>
        
      </AppBar>
    </div>
  );
}