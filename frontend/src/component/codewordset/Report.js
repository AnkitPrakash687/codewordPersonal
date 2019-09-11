import React, { useState, Component, useEffect } from 'react';
import { green, lightGreen, red, grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import API from '../../utils/API'
import { Paper, Grid, Box, Typography,CircularProgress, Button, Container, CssBaseline, 
    Select, MenuItem, FormControl, FormHelperText, InputLabel } from '@material-ui/core';
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
        marginBottom: theme.spacing(4 )
    },

    heading:{
        borderRadius: 5,
        background: green[600],
        padding: theme.spacing(1),
    },
    progress:{
        margin: theme.spacing(2),
    }
}));

export default function Report(props) {
    const classes = useStyles();
    const [render, setRender] = useState(false);
    const [similarCodewords, setSimilarCodewords] = useState([]);
    const [anagrams, setAnagrams] = useState([])
    const [loading, setLoading] = useState()
    const [level, setLevel] = useState()
    useEffect(() => {
        setLoading(true)
        console.log('report')
        console.log(props.id)
        const headers = {
            'token': sessionStorage.getItem('token')
        };

        API.post('dashboard/generateReport', { id: props.id, level:level }, { headers: headers }).then(response => {
            console.log(response.data)
            if (response.data.code == 200) {
                console.log(response.data.data)
                setSimilarCodewords(response.data.data.similars)
                setAnagrams(response.data.data.anagrams)
                setLoading(false)
            }
        })
    }, [render])

    const handleRender = () =>{
        setRender(!render)
    }
    const listCodeword =
        similarCodewords.map((item) => {
            return <ReportCard id={props.id} items={item} render={handleRender}></ReportCard>
        })
    // const handleClick = () =>{
    //     setRender(!render)
    //     console.log(render)
    // }
    const listAnagrams =
    anagrams.map((item) => {
        return <ReportCard id={props.id} items={item} render={handleRender}></ReportCard>
    })

 
    const handleChange = (event) => {
        setLevel(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
          }));
    }
    return (
        <div>

            <Container component="main" maxWidth="lg">
                <CssBaseline />
                {
                   
                loading ? 
                <Grid container
                 spacing={0}
                 alignItems="center"
                 justify="center"
                 style={{ minHeight: '100vh' }}>
                <CircularProgress className={classes.progress} />
                </Grid>
                :
                <div>
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
                  
                <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-helper">Age</InputLabel>
        <Select
          value={level}
          onChange={handleChange}
          inputProps={{
            name: 'age',
            id: 'age-helper',
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Some important helper text</FormHelperText>
      </FormControl>

                    <Grid container >

                        {
                            listCodeword
                        }

                    </Grid>
                </Paper>

                <Paper>
                <Box className={classes.heading}>
                        <Typography component="div">
                            <Box fontSize="h6.fontSize"  m={1}>
                                Anagrams
                            </Box>
                        </Typography>
                    </Box>
                    </Paper>
                <Paper className={classes.paper}>
                  
                    <Grid container >

                        {
                            listAnagrams
                        }

                    </Grid>
                </Paper>
                </div>
                }
            </Container>
        </div>
    )
}

