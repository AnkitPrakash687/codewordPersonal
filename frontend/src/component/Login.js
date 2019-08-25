import React, { useState, Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom"
import API from "../utils/API";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dashboard from './Dashboard';
import { withStyles } from '@material-ui/core/styles';


const useStyles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  root: {
    padding: theme.spacing(3, 2),
    margin: theme
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});


class SignIn extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      isLoggedIn: false,
      message: '',
      error: false
    }
  
  }

  render() {

    function handleSubmit(event) {
      event.preventDefault()
      const data = this.state
      // console.log(data)
      //const validation = validator.validate(state);
      //setState({ validation });
      //console.log(validation)
      //if (validation.isValid) {

      API
        .post(
          'auth/signin', data)
        .then(response => {
          sessionStorage.setItem('token', response.data.token)
          
          // console.log('👉 Returned data:', response);
          console.log(response.data)
          if (response.data.code == 200) {
            this.setState({
              isLoggedIn: true,
            })
            console.log(this.state)
          } else {
            this.setState({
              isLoggedIn: false,
              message: response.data.message,
              error: true
            })
          }
        }).catch(error => {
          console.log('login error', error)
        })
        ;


      //  }

    }

    const handleChange = name => (event) => {
      console.log({ [name]: event.target.value })
      this.setState({ ...this.state, [name]: event.target.value });
      // if([name]=='instructor'){
      //     setState({ ...state, [name]: isChecked });
      // }

    }

    const handleClose = (event) => {
     this.setState({
       error: !this.state.error
     })

    }


    const { classes } = this.props;

    if (this.state.isLoggedIn) {
      return <Redirect to='/'></Redirect>
    }

    return (
      <Grid container
        spacing={0}
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Paper className={classes.root}>
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
        </Typography>
              <form onSubmit={handleSubmit.bind(this)} className={classes.form} >
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={this.state.email}
                  onChange={handleChange('email')}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={this.state.password}
                  onChange={handleChange('password')}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign IN
          </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
              </Link>
                  </Grid>
                  <Grid item>
                    <Link to="/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link to={{ pathname: "/dashboard", state: { isAuth: true } }}>
                      {"Dashboard"}
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Paper>

          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.error}
            autoHideDuration={6000}
            variant="success"
            onClose={handleClose}
            message={this.state.message}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          >

          </Snackbar>

        </Container>

      </Grid>
    );


  }
}
export default withStyles(useStyles)(SignIn)