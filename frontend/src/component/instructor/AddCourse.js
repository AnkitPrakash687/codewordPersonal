import Typography from '@material-ui/core/Typography';
import React, { useState, Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import { green, lightGreen, red } from '@material-ui/core/colors';
import { Paper, Grid } from '@material-ui/core';
import {withRouter} from 'react-router-dom'
import API from '../../utils/API'
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from 'material-ui-pickers';

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
 class AddCourse extends Component{

    constructor(props){
        super(props);
    this.state = {
        role:'',
        token: sessionStorage.getItem('token'),
        courseName:'',
        startSurvey:'',
        endSurvey:'',
        startDate:'',
        endDate:'',
        selectedDate:''
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

        const handleSubmit = (event) =>{

        }

        const handleChange = name => (event, isChecked) => {
            console.log({[name]: event.target.value})
            this.setState({ ...this.state, [name]: event.target.value });
            if([name]=='instructor'){
                this.setState({ ...this.state, [name]: isChecked });
            }
            
        }

        const handleDateChange = (date) =>{
            this.setState({
                selectedDate: date
            })
        }
    return(
        <Container component="main" maxWidth="xs">
        <CssBaseline />
     
     <div className={classes.paper}>
        <form onSubmit={handleSubmit.bind(this)} className={classes.form} >
            <TextField  className={classes.textField}
            variant="outlined"
            required
            fullWidth
            id="courseName"
            label="Course Name"
            name="courseName"
            autoComplete="courseName"
            autoFocus
            margin="dense"
            onChange={handleChange('courseName')}
            value={this.state.firstName}
          />

<   MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="normal"
          format="MM/dd/yyyy"
          margin="normal"
          id="start-date"
          label="Start Date"
          value={this.state.startDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
         <KeyboardDatePicker
          disableToolbar
          variant="normal"
          format="MM/dd/yyyy"
          margin="normal"
          id="end-date"
          label="End Date"
          value={this.state.endDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
     
        />
      </Grid>
    </MuiPickersUtilsProvider>

        <TextField  className={classes.textField}
            variant="outlined"
            fullWidth
            id="startSurvey"
            label="Start Survey"
            name="startSurvey"
            autoComplete="startSurvey"
            autoFocus
            margin="dense"
            onChange={handleChange('startSurvey')}
            value={this.state.startSurvey}
          />    
        <TextField  className={classes.textField}
            variant="outlined"
            fullWidth
            id="endSurvey"
            label="Start Survey"
            name="endSurvey"
            autoComplete="endSurvey"
            autoFocus
            margin="dense"
            onChange={handleChange('endSurvey')}
            value={this.state.startSurvey}
          /> 
        </form>
        </div>
      
        </Container>
    );
    }
}
export default withStyles(useStyles)(AddCourse);