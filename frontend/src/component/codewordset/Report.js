import React, { useState, Component, useEffect } from 'react';
import { green, lightGreen, red, grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import API from '../../utils/API'
import { Paper, Grid, Box, Button, Container, CssBaseline, Snackbar, IconButton, Dialog, DialogTitle } from '@material-ui/core';
import ReportCard from './ReportCard'
const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 20,
        flexGrow: 1,
        //  background: theme.palette.background.paper,
        background: lightGreen[200],
        minHeight: 500

    },
    paper: {
        borderRadius: 5,
        paddingBottom: 20,
        maxWidth: 300,
        minWidth:200
    }
}));

export default function Report(props) {
    const classes = useStyles();
    const [render, setRender] = useState(false);
    const [similarCodewords, setSimilarCodewords] = useState([['Apple','Banana']]);
    useEffect(()=>{
        console.log('report')
        console.log(props.id)
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.post('dashboard/generateReport', { id: props.id }, { headers: headers }).then(response => {
            console.log(response.data)
            if (response.data.code == 200) {
                console.log(response.data.data)
               setSimilarCodewords(response.data.data)
            }
        })
    }, [])


    const listCodeword = 
        similarCodewords.map((item)=>{
         return <ReportCard items={item}></ReportCard>
        })
    
    return(
        <div>
            <Grid container >
               
            {
                listCodeword
            }
        
            </Grid>
        </div>
    )
}

