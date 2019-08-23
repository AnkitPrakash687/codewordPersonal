import Typography from '@material-ui/core/Typography';
import React, {useState, Component} from 'react';
import API from "../utils/API";


 class Dashboard extends Component{

    constructor(props){
        super(props);
    this.state = {
        id: '',
        name: '',
        role:'',
        token: localStorage.getItem('token',0)
      }
    }

     async getData(){
        
        const headers = {
            'Content-Type': 'application/json',
            'token':  this.state.token
          };
         
        console.log(headers)
         try {
            const response = await API.get('dashboard/details', {headers});
            console.log('👉 Returned data:', response);
            console.log(response.data)
            if(response.data.code == 200){
            this.state = {
              id: response.data.email_id,   
              role: response.data.role,
              name: response.data.first_name + ' ' + response.data.last_name
            }
            
        }else {
        
        }
          } catch (e) {
            console.log(`😱 Axios request failed: ${e}`);
          }
      //  }
    
    }

    componentDidMount(){
        this.getData()
    }
    render(){
    return(
        <Typography>
            Dashboard 
        </Typography>
    );
    }
}
export default Dashboard;