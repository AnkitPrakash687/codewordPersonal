import Typography from '@material-ui/core/Typography';
import React, { useState, Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red } from '@material-ui/core/colors';
import { Paper, Grid } from '@material-ui/core';
import CourseCard from './CourseCard'
import CodewordsetCard from '../codewordset/CodewordsetCard'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button'
import AddCourse from './AddCourse'
import API from '../../utils/API'

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
    button: {
        marginBottom: theme.spacing(2)
    }
}));

export default function InstructorDashboard() {


    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false)

    const classes = useStyles();
    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                <Box bgcolor={lightGreen[100]} height={500} p={3}>{children}</Box>
            </Typography>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    const [render, setRender] = useState(false);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    function SimpleDialog(props) {

        const { onClose, open, render } = props;

        const handleClose = (error) => {
            console.log('render   ' + render)
            setRender(!render)
            onClose();
        }

        function handleListItemClick(value) {
            onClose(value);
        }

        return (
            <Dialog fullWidth={true} disableBackdropClick={true} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle id="simple-dialog-title">Add Course</DialogTitle>
                <AddCourse onClose={handleClose}></AddCourse>
            </Dialog>
        );
    }

    SimpleDialog.propTypes = {
        onClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        render: PropTypes.bool.isRequired,
    };

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = value => {
        setOpen(false)
    };

    const [courseData, setCourseData] = useState([{}])
    const [codewordsetData, setCodewordsetData] = useState([{}])
    useEffect(() => {

        console.log('inside effect')
        const headers = {
            'token': sessionStorage.getItem('token')
        };
        API.get('dashboard/getCourseList', { headers: headers }).then(response => {
            console.log('👉 Returned data in :', response);

            if (response.status == 200) {
                console.log(response.data)
                var data = response.data.data
                var result = []
                data.map((course) => {
                    var ack = 0
                    ack = course.students.reduce((acc, item) => {
                        if (item.isRevealed) {
                            return acc + 1
                        } else {
                            return acc + 0
                        }
                    }, 0)
                    result.push({
                        id: course._id,
                        courseName: course.courseNameKey,
                        startDate: (course.Startdate.toString()).substring(0, 10),
                        endDate: (course.Enddate.toString()).substring(0, 10),
                        startSurvey: course.PreSurveyURL == '' ? 'Unpublished' : course.PreSurveyURL,
                        endSurvey: course.PostSurveyURL == '' ? 'Unpublished' : course.PostSurveyURL,
                        isAssigned: course.isAssigned,
                        'ack': ack + '/' + course.students.length
                    })
                })

                console.log(result)
                setCourseData(result)
                //   setState({
                //     status:true,
                //     message:response.data.message,
                //   }) 
                // }else{
                //   console.log('error')
                //   setState({
                //     courseName:state.courseName,
                //     startDate: state.startDate,
                //     endDate: state.endDate,
                //     status:true,
                //     error:true,
                //     message:response.data.message
                //   })
            }
        })
            .catch(error => {
                console.log(error)
                //   console.log('error')
                //   setState({
                //     courseName:state.courseName,
                //         startDate: state.startDate,
                //         endDate: state.endDate,
                //     status:true,
                //     error:true,
                //     message:error.message
                //   })
            })
    }, [render])

    const listCourses = courseData.map((course) => {
        return <CourseCard id={course.id}
            courseName={course.courseName}
            ack={course.ack}
            startDate={course.startDate}
            endDate={course.endDate}
            startSurvey={course.startSurvey}
            endSurvey={course.endSurvey}
            isAssigned={course.isAssigned}
        ></CourseCard>
    })

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Tabs variant='fullWidth' centered={true} value={value} onChange={handleChange} aria-label="simple tabs example" >
                    <Tab label="Course" {...a11yProps(0)} />
                    <Tab label="Codeword" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>

                <Button variant="contained" color="primary" className={classes.button} onClick={handleClickOpen}>
                    Add Course
                </Button>
                <SimpleDialog open={open} onClose={handleClose} render={render} />

                <Grid container spacing={3}>

                    {
                        listCourses
                    }

                </Grid>

            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
        </TabPanel>

        </div>

    );

}
