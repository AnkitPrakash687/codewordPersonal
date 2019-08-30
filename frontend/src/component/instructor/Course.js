import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Appbar from '../MyAppBar'
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red, grey } from '@material-ui/core/colors';
import { Paper, Grid, Box, Button, Container, CssBaseline } from '@material-ui/core';
import { withRouter } from 'react-router-dom'
import API from '../../utils/API'
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import { Redirect } from "react-router-dom";
import MaterialTable from 'material-table';
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };
const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 20,
        flexGrow: 1,
        //  background: theme.palette.background.paper,
        background: lightGreen[200],
        minHeight: 500

    },
    header: {
        background: green[300],
        border: 1,
        borderRadius: 5,
        minHeight: 40

    },
    course: {
        margin: theme.spacing(4),
        background: grey[100],
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: grey[400],
        borderRadius: 10,
        minHeight: 100,
        maxWidth: 800,
        padding: theme.spacing(2)
    },
    table:{
        
        padding: theme.spacing(4)
    },
    assign: {
        margin: theme.spacing(1),
        background: green[500]
    },
    edit: {
        margin: theme.spacing(1),
    },
    delete: {
        margin: theme.spacing(1),
        background: red[700]
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
        id: props.match.params.id,
        courseName: '',
        startDate: '',
        endDate: '',
        startSurvey: '',
        endSurvey: '',
        isAssigned: '',
        codewordset: '',
        ack: '',
    })

   
    const [table, setTable] = useState({
        columns: [
            { title: 'Name', field: 'name' },
            { title: 'Email', field: 'email' }
        ],
        data: [],
    })

    useEffect(() => {

        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.get('dashboard/getcourse/' + state.id, { headers: headers }).then(response => {
            console.log('👉 Returned data in :', response);

            if (response.status == 200) {
                console.log(response.data)
                var course = response.data.data
                var studentList = course.students.map((student) => {
                    return {email:student.email}
                })

                setTable({
                    columns: [
                        { title: 'Name', field: 'name' },
                        { title: 'Email', field: 'email' }
                    ],
                    data:studentList})
                var ack = course.students.reduce((acc, item) => {
                    if (item.isRevealed) {
                        return acc + 1
                    } else {
                        return acc + 0
                    }
                }, 0)
                setState({
                    id: course._id,
                    courseName: course.courseNameKey,
                    startDate: (course.Startdate.toString()).substring(0, 10),
                    endDate: (course.Enddate.toString()).substring(0, 10),
                    startSurvey: course.PreSurveyURL == '' ? 'Unpublished' : course.PreSurveyURL,
                    endSurvey: course.PostSurveyURL == '' ? 'Unpublished' : course.PostSurveyURL,
                    isAssigned: course.isAssigned,
                    codewordset: course.codewordSet == '' ? 'Not Assigned' : course.codewordset,
                    ack: ack + '/' + course.students.length
                })
                console.log(studentList)
            }
        })
            .catch(error => {
                console.log(error)
            })
    }, [])
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
            <Container component="main" maxWidth='lg'>
                <CssBaseline />
                <div className={classes.root}>

                    <Box className={classes.header} >
                        <Grid container >
                            <Grid item sm={6}>
                                <Grid container direction="column" >
                                    <Grid item>
                                        <Typography component="div">
                                            <Box fontSize="h6.fontSize" fontWeight="fontWeightBold" m={1}>
                                                {state.courseName}
                                            </Box>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Grid container>
                                            <Grid item>
                                                <Typography variant="caption" className={classes.title}>
                                                    Start Date: {state.startDate}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="caption" className={classes.title}>
                                                    End date: {state.endDate}
                                                </Typography>
                                            </Grid>

                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={3}>

                            </Grid>
                            <Grid item sm={3}>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    className={classes.assign}>
                                    assign
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    className={classes.edit}>
                                    edit
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    className={classes.delete} >
                                    delete
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <div border={1} className={classes.course}>
                        <Grid container >
                            <Grid item sm={6} md={6} lg={6}>
                                <Grid container direction="column">
                                    <Grid item xs={12} >
                                        <Typography component="div">
                                            <Box fontSize="h6.body" fontWeight="fontWeightBold" m={1}>
                                                Acknowledged: {state.ack}
                                            </Box>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Typography component="div">
                                            <Box fontSize="h6.body" fontWeight="fontWeightBold" m={1}>
                                                Codeword Set: {state.codewordset}
                                            </Box>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={6} md={6} lg={6}>
                                <Grid container direction="column">
                                    <Grid item xs={12} >
                                        <Typography component="div">
                                            <Box fontSize="h6.body" fontWeight="fontWeightBold" m={1}>
                                                Start Survey: {state.startSurvey}
                                            </Box>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography component="div">
                                            <Box fontSize="h6.body" fontWeight="fontWeightBold" m={1}>
                                                End Survey: {state.endSurvey}
                                            </Box>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                    </div>
            <div className={classes.table}>
                <MaterialTable
                icons={tableIcons}
                title="Students"
                columns={table.columns}
                data={table.data}
                options={{
                    actionsColumnIndex: -1,
                    headerStyle:{
                        fontSize:15
                    }
                  }}
                editable={{
                  onRowAdd: newData =>
                    new Promise(resolve => {
                      setTimeout(() => {
                        resolve();
                        const data = [...table.data];
                        data.push(newData);
                        setState({ ...state, data });
                      }, 600);
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise(resolve => {
                      setTimeout(() => {
                        resolve();
                        const data = [...table.data];
                        data[data.indexOf(oldData)] = newData;
                        setState({ ...table, data });
                      }, 600);
                    }),
                  onRowDelete: oldData =>
                    new Promise(resolve => {
                      setTimeout(() => {
                        resolve();
                        const data = [...table.data];
                        data.splice(data.indexOf(oldData), 1);
                        setState({ ...table, data });
                      }, 600);
                    }),
                    
                }}
                        />
                        </div>  
                </div>

            </Container>
        </div>
    );

}
