import Typography from '@material-ui/core/Typography';
import React, { useState, Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red } from '@material-ui/core/colors';
import { Paper, Grid } from '@material-ui/core';
import {withRouter} from 'react-router-dom'
import API from '../../utils/API'
const useStyles = theme => ({
    root: {
        margin: 30,
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        background: green[600]
    },
    paper: {
        paddingBottom: 20
    },
    paper2: {
        padding: 20,
        margin: 20,
        background: lightGreen[200]
    },
    title: {
        padding: 10
    },
    banner1: {
        background: lightGreen[200],
        paddingLeft: 20
    },
    banner2: {
        background: red[200],
        padding: 10

    }
});
 class CourseCard extends Component{

    constructor(props){
        super(props);
    this.state = {
        role:'',
        token: sessionStorage.getItem('token')
      }
    }

     async getData(){
        console.log('getdata')
        const headers = {
            'Content-Type': 'application/json',
            'token':  this.state.token
          };
         
        console.log(headers)
         try {
            const response = await API.get('dashboard/details', {headers});
            console.log('👉 Returned data in :', response);
            console.log(response.data)
            if(response.status == 200){
            this.setState( {
              id: response.data.email_id,   
              role: response.data.role,
              name: response.data.first_name + ' ' + response.data.last_name
            })
            console.log('dashbaord : '+ this.state.role)
            
        }else {
        
        }
          } catch (e) {
            console.log(`😱 Axios request failed: ${e}`);
          }
      //  }
    
    }

    componentDidMount(){
    //    this.getData()
    }
    render(){
       
        const {classes} = this.props
    return(
        <Grid item xs={12} sm={3} md={3} lg={3}>
        <Paper className={classes.paper}>
            <div className={classes.appBar}>
                <AppBar position="static" className={classes.appBar}>
                    <Typography variant="h6" className={classes.title}>
                        44618-01/05-19Su PROJECT MGMT IN BUS & TECH
                    </Typography>
                </AppBar>
            </div>

            <Paper className={classes.paper2}>
                <Typography variant="h8" className={classes.title}>
                    Aknowledged:
                    </Typography><br></br>
                <Typography variant="h8" className={classes.title}>
                    Start Survey:
                    </Typography><br></br>
                <Typography variant="h8" className={classes.title}>
                    End Survey
                    </Typography>
            </Paper>
            <Grid  container spacing={0}>
            <Grid   item xs={12} sm={6} md={6} lg={6}>
            <Typography align="center" variant="button" className={classes.title}>
                Start date: 06/12/2019
            </Typography>
           </Grid>
           <Grid item xs={12} sm={6} md={6} lg={6}>
            <Typography align="right" variant="button" className={classes.title}>
                End Date: 09/12/2019
            </Typography>
            </Grid>
            </Grid>
            {1 == 2 ?
                <Paper className={classes.banner1}>

                    <Typography variant="h8" className={classes.title}>
                        CODEWORD ASSIGNED
                    </Typography>
                </Paper> :
                <Paper className={classes.banner2}>
                    <Typography variant="h8" className={classes.title}>
                        CODEWORD NOT ASSIGNED
                    </Typography>
                </Paper>
            }
        </Paper>
    </Grid>
    );
    }
}
export default withStyles(useStyles)(CourseCard);