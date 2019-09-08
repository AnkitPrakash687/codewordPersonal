import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red, grey } from '@material-ui/core/colors';
import {
    Paper, Grid, Button, FormControl, InputLabel,
    MenuItem, OutlinedInput, Select, Box, Snackbar, IconButton, Chip, 
    Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText
} from '@material-ui/core';
import { withRouter } from 'react-router-dom'
import API from '../../utils/API'
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';
import { flexbox } from '@material-ui/system';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';

const Papa = require('papaparse')
var moment = require('moment');
var _ = require("underscore");
const useStyles = makeStyles(theme => ({
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

    },
    formControl: {
        marginTop: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
    textField: {
        marginTop: theme.spacing(2)
    },
    button: {
        margin: theme.spacing(1)
    },
    chip: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(1)
    },
    submit: {
        background: green[600],
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        "&:hover": {
            backgroundColor: "green"
        }
    },
    cancel: {
        background: red[600],
        margin: theme.spacing(2),
        "&:hover": {
            backgroundColor: "red"
        }
    },
    paper: {
        background: lightGreen[100],
        padding: theme.spacing(1),
        borderRadius: 5
    }
}));

export default function AddCodewordSet(props) {
    const classes = useStyles();
    const [state, setState] = useState({
        role: '',
        token: sessionStorage.getItem('token'),
        courseName: '',
        studentFilename: '',
        filename: '',
        selectedFile: null,
        status: false,
        error: false,
        message: '',
        reRender: false,
        alertOpen: true
    })
   
    const fileLabel = React.useRef(null)
    const [codeword, setCodeword] = useState([{
        codewordSetName: '',
        count: 0,
        codewords:[]
    }])

    useEffect(() => {
        console.log('getdata')
        const headers = {
            'Content-Type': 'application/json',
            'token': state.token
        };
        API.get('dashboard/getcodewordset', { headers: headers }).then(response => {
            if (response.data.code == 200) {
                setCodeword(
                    response.data.data.map((codewordSet) => {
                        console.log(codewordSet)
                        return {
                            codewordSetName: codewordSet.codewordSetName,
                            count: codewordSet.count,
                            codewords: codewordSet.codewords
                        }
                    })
                )
                console.log(response.data.data)
            }
        })

    }, [])

    const handleChange = name => (event, isChecked) => {
        //console.log({[name]: event.target.value})
        setState({ ...state, [name]: event.target.value });
        if ([name] == 'values') {
            console.log('inise code')
            var count = codeword.filter((item) => {
                if (item.codewordSetName == event.target.value) {
                    return item.count
                }
            })
          
        }

    }
    const handleFileChange = (event) => {
        if (fileLabel.current.files[0] && fileLabel.current.files[0].name) {
            setState({ ...state, filename: fileLabel.current.files[0].name, selectedFile: event.target.files[0] });
            Papa.parse(event.target.files[0], {
                complete: function (results) {
                    console.log(results)
                    var students = results.data.filter((item) => {
                        if (item[0] != '') {
                            return item
                        }
                    })
                
                }
            })

        }
    }

    const handleDateChange = name => (date) => {
        setState({ ...state, [name]: date });
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const headers = {
            "Content-Type": "multipart/form-data",
            'token': sessionStorage.getItem('token')
        };
        var data = {
            courseNameKey: state.courseName,
            startDate: state.startDate,
            endDate: state.endDate,
            preSurveyURL: state.startSurvey,
            postSurveyURL: state.endSurvey,
            codeWordSetName: state.values,

        }
        console.log(data)
        var formData = new FormData()
        formData.append('file', state.selectedFile)
        _.each(data, (value, key) => {
            console.log(key + " " + value)
            formData.append(key, value)
        })
        for(var i in codeword){
            if(state.values == codeword[i].codewordSetName){
                formData.append('codewords', codeword[i].codewords)
            }
        }
        

        API.post('dashboard/addnewCourse', formData, { headers: headers }).then(response => {
            console.log('👉 Returned data in :', response);
            if (response.status == 200) {
                setState({
                    status: true,
                    message: response.data.message,
                    reRender: true
                })
            } else {
                console.log('error')
                setState({
                    courseName: state.courseName,
                    startDate: state.startDate,
                    endDate: state.endDate,
                    status: true,
                    error: true,
                    message: response.data.message,
                })
            }
        })
            .catch(error => {
                console.log(error)
                console.log('error')
                setState({
                    courseName: state.courseName,
                    startDate: state.startDate,
                    endDate: state.endDate,
                    status: true,
                    error: true,
                    message: error.message
                })
            })
            ;



    }

    const handleClose = () => {
       
        props.onClose()
    
    }

    const handleMessageClose = () => {
        setState({
            courseName: state.courseName,
            startDate: state.startDate,
            endDate: state.endDate,
            status: false
        })
        if (!state.error) {
            props.onClose(state.error)
        }
    }

    const handleDelete = () => {

    }
    AddCodewordSet.propTypes = {
        onClose: PropTypes.func.isRequired
    };

    
    function countAlert(props) {
        const { message, open, handleClose} = props
        return(
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{"Warning"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {message}
        </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
                OK
            </Button>
        </DialogActions>
    </Dialog>
        )
    }

    const [alertOpen, setAlertOpen] = useState(true)
    const handleAlertClose = () =>{
        setAlertOpen(false)
    }
    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />


            <form enctype="multipart/form-data" onSubmit={handleSubmit} className={classes.form} >
                <div className={classes.paper}>
                    <TextField className={classes.textField}
                        variant="outlined"
                        required
                        fullWidth
                        id="codewordSetName"
                        label="Codeword Set Name"
                        name="codewordSetName"
                        autoFocus
                        margin="dense"
                        onChange={handleChange('codewordSetName')}
                        value={state.firstName}
                    />
                    <input
                        accept=".csv"
                        className={classes.input}
                        id="text-button-file"
                        multiple
                        type="file"
                        ref={fileLabel}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="text-button-file">
                        <Grid container spacing={1}>
                            <Grid item xs={8} sm={8} md={8} lg={8}>
                                <TextField fullWidth="true" className={classes.textField}
                                    id="filename"
                                    name="filename"
                                    disabled="true"
                                    margin="dense"
                                    value={state.filename}
                                />
                            </Grid>
                            <Grid item xs={4} sm={4} md={4} lg={4}>
                                <Button variant="contained" component="span" color="primary" className={classes.button}>
                                    Upload
                                    <CloudUploadIcon className={classes.rightIcon} />
                                </Button>
                            </Grid>
                        </Grid>

                    </label>

                  
                </div>
                <Box display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.cancel}
                        onClick={handleClose}
                    >
                        Cancel
          </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.submit}
                    >
                        Add
          </Button>



                </Box>


            </form>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={state.status}
                autoHideDuration={2000}
                variant="success"
                onClose={handleMessageClose}
                message={state.message}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={classes.close}
                        onClick={handleMessageClose}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            ></Snackbar>
            {/* { 
            ((parseFloat(studentCount)-parseFloat(codewordCount))/parseFloat(codewordCount)) < 0.1 ?
            <Dialog
        open={alertOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{"Warning"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {'message'}
        </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleAlertClose} color="primary" autoFocus>
                OK
            </Button>
        </DialogActions>
    </Dialog>
            :
            (codewordCount-studentCount) < 0?
            <countAlert open={true} handleClose={handleClose('alertOpen')} message="Student count exceeds codeword count"></countAlert>:false
            }
          */}
        </Container>
    );
}

