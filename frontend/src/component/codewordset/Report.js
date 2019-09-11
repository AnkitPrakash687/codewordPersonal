import React, { useState, Component, useEffect } from 'react';
import { green, lightGreen, red, grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import API from '../../utils/API'
import { Paper, Grid, Box, Typography, Button, Container, CssBaseline, Snackbar, IconButton, Dialog, DialogTitle } from '@material-ui/core';
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
        background: lightGreen[300],
        padding: theme.spacing(2),
    },

    heading:{
        borderRadius: 5,
        background: green[600],
        padding: theme.spacing(1)

    }
}));

export default function Report(props) {
    const classes = useStyles();
    const [render, setRender] = useState(false);
    const [similarCodewords, setSimilarCodewords] = useState([]);
    useEffect(() => {
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
    }, [render])


    const listCodeword =
        similarCodewords.map((item) => {
            return <ReportCard items={item}></ReportCard>
        })
    // const handleClick = () =>{
    //     setRender(!render)
    //     console.log(render)
    // }

    return (
        <div>

            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Paper>
                <Box className={classes.heading}>
                        <Typography component="div">
                            <Box fontSize="h6.fontSize"  m={1}>
                                Similar Codewords
                            </Box>
                        </Typography>
                    </Box>
                    </Paper>
                <Paper className={classes.paper}>
                  
                    <Grid container >

                        {
                            listCodeword
                        }

                    </Grid>
                </Paper>
            </Container>
        </div>
    )
}

