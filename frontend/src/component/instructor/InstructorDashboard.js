import Typography from '@material-ui/core/Typography';
import React, { useState, Component } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red } from '@material-ui/core/colors';
import { Paper, Grid } from '@material-ui/core';
import Card from './CourseCard'

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

class InstructorDashboard extends Component {


    constructor(props) {
        super(props)
        this.state = {
            value: 0
        }
    }

    render() {
        const { classes } = this.props
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

        const handleChange = (event, newValue) => {
            this.setState({ value: newValue });
        }

        return (
            <div className={classes.root}>
                <AppBar position="static" className={classes.appBar}>
                    <Tabs variant='fullWidth' centered={true} value={this.state.value} onChange={handleChange} aria-label="simple tabs example" >
                        <Tab label="Course" {...a11yProps(0)} />
                        <Tab label="Codeword" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={this.state.value} index={0}>
                    <Grid container spacing={3}>

                        <Card></Card>
                        <Card></Card>
                        <Card></Card>
                        <Card></Card>

                    </Grid>

                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    Item Two
        </TabPanel>

            </div>

        );
    }
}

export default withStyles(useStyles)(InstructorDashboard)