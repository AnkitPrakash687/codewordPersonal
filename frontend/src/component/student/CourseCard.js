import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red } from '@material-ui/core/colors';
import { Paper, Grid, Button, Zoom } from '@material-ui/core';
import { withRouter } from 'react-router-dom'
import API from '../../utils/API'
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import { Redirect } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        margin: 30,
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        borderRadius: 5,
        background: green[600]
    },
    paper: {
        borderRadius: 5,
        paddingBottom: 20,
        maxWidth: 300,
        minWidth:200
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
export default function CourseCard(props) {
    const classes = useStyles();
    const [state, setState] = useState({
        role: '',
        token: sessionStorage.getItem('token')
    })
    const [reveal, setReveal] = useState(true)
    useEffect(() => {
        // console.log('getdata')
        // const headers = {
        //     'Content-Type': 'application/json',
        //     'token': state.token
        // };
       
        // API.get('dashboard/getcodewordset', { headers: headers }).then(response => {
        //     if (response.data.code == 200) {
        //         setCodeword(
        //             response.data.data.map((codewordSet) => {
        //                 console.log(codewordSet)
        //                 return {
        //                     codewordSetName: codewordSet.codewordSetName,
        //                     count: codewordSet.count,
        //                     codewords: codewordSet.codewords
        //                 }
        //             })
        //         )
        //         console.log(response.data.data)
        //     }
        // })
    },[])
  
    
    const handleClickReveal =()=>{
        setReveal(false)
        const headers = {
            'token': sessionStorage.getItem('token')
        };

        API.post('dashboard/reveal',{courseId: props.id}, { headers: headers }).then(response => {
            
        })

    }

    return (

        <Grid item xs={12} sm={3} md={3} lg={3}>
            
                <Paper className={classes.paper}>
       
                    <div className={classes.appBar}>
                        <AppBar position="static" className={classes.appBar}>
                            <Typography variant="h6" className={classes.title}>
                                {props.courseName}
                            </Typography>
                        </AppBar>
                    </div>

                    <Paper className={classes.paper2}>
                        <Zoom in={reveal}>
                    <Button variant="contained" color="primary" className={classes.button} onClick={handleClickReveal}>
                    Reveal
                </Button>
                </Zoom>
                    </Paper>
                    <Grid className={classes.dates} container spacing={0}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Typography variant="caption" className={classes.title}>
                                Start date: {props.startDate}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Typography variant="caption" className={classes.title}>
                                End Date: {props.endDate}
                            </Typography>
                        </Grid>
                    </Grid>
                   
               
                </Paper>
           
        </Grid>

    );

}
