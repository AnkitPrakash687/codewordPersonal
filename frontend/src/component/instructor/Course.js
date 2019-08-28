import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Appbar from '../MyAppBar'
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red } from '@material-ui/core/colors';
import { Paper, Grid, Box, Button, Container, CssBaseline} from '@material-ui/core';
import { withRouter } from 'react-router-dom'
import API from '../../utils/API'
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import { Redirect } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 20,
        flexGrow: 1,
      //  background: theme.palette.background.paper,
      background: lightGreen[200],
      minHeight: 500

    },
    header:{
        background: green[500],
        border: 1,
        borderRadius: 5,
        minHeight: 80
    },
    button:{
       margin: theme.spacing(1) 
    },
    appBar: {
        borderRadius: 5,
        background: green[600]
    },
    paper: {
        borderRadius: 5,
        paddingBottom: 20
    },
    paper2: {
        padding: 10,
        margin: 10,
        background: lightGreen[200]
    },
    title: {
        padding: 10
    },
    banner1: {
        background: lightGreen[200],
        padding: 5,
        marginTop: 5
    },
    banner2: {
        background: red[200],
        padding: 5,
        marginTop: 5

    }
}));
export default function Course(props) {
    const classes = useStyles();
    const [state, setState] = useState({
        role: '',
        token: sessionStorage.getItem('token')
    })

    useEffect(() => {
        // console.log('getdata')
        // const headers = {
        //     'Content-Type': 'application/json',
        //     'token':  this.state.token
        //   };

        // console.log(headers)
        //  try {
        //     const response = await API.get('dashboard/details', {headers});
        //     console.log('👉 Returned data in :', response);
        //     console.log(response.data)
        //     if(response.status == 200){
        //     this.setState( {
        //       id: response.data.email_id,   
        //       role: response.data.role,
        //       name: response.data.first_name + ' ' + response.data.last_name
        //     })
        //     console.log('dashbaord : '+ this.state.role)

        // }else {

        // }
        //   } catch (e) {
        //     console.log(`😱 Axios request failed: ${e}`);
        //   }
    })
    const [redirect, setRedirect] = useState(false);
    const handleCardClick = () => {
        console.log('click working')
        setRedirect(true)

    }
    if (redirect) {
        return <Redirect to="/signup"></Redirect>
    }

    return (
        <div>
            <Appbar isLoggedIn={true}></Appbar>
            <Container component="main" maxWidth='xl'>
          <CssBaseline />
            <div className={classes.root}>
               
                <Box className={classes.header} >
                    <Box minWidth="xs" display="flex" justifyContent="flex-start">
                        <Typography variant="h6" className={classes.title}>
                            44618-01/05-19Su PROJECT MGMT IN BUS & TECH
                        </Typography> 
                    </Box>
                    <Grid className={classes.dates} container spacing={0}>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <Typography variant="caption" className={classes.title}>
                                Start date: 09/20/2019
                            </Typography>
                        </Grid>
                        <Grid item xs={12}  sm={4} md={4} lg={4}>
                            <Typography variant="caption" className={classes.title}>
                                End Date: 09/20/2019
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box padding={2} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.button}
                       
                    >
                        assign
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.edit}
                    >
                        edit 
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        className={classes.delete}
                        background={green[500]}
                    >
                        delete
                    </Button>

                </Box>

                </Box>
                
                <Grid container >
                    <Grid item xs={12} sm={3} md={3} lg={3}>

                    </Grid>
                </Grid>
            </div>
            </Container>
        </div>
    );

}
