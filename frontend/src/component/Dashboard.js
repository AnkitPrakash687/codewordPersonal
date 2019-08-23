import Typography from '@material-ui/core/Typography';
import React, {useState} from 'react';
import API from "../utils/API";


export default function Dashboard(props) {

    const [state, setState] = useState({
        isAuth: 'Auth: '+ localStorage.getItem('token',0)
      })

    //   async function handleSubmit(event){
    //     event.preventDefault()
    //      const data = state
    //     // console.log(data)
    // //const validation = validator.validate(state);
    // //setState({ validation });
    // //console.log(validation)
    // //if (validation.isValid) {
    //      try {
    //         const response = await API.get('dashboard/details', data);
    //         console.log('👉 Returned data:', response);
    //         console.log(response.data.code)
    //         if(response.data.code == 200){
    //         setSuccess({
    //             status:true,
    //             message: response.data.message,
    //             code: response.data.code
    //         })
    //         setState({
    //           role: response.data.role,
    //           token: response.data.token
    //         })
            
    //     }else {
    //         setSuccess({
    //             status:true,
    //             message: response.data.message,
    //             code: response.data.code
    //         })
    //     }
    //       } catch (e) {
    //         console.log(`😱 Axios request failed: ${e}`);
    //       }
    //   //  }
    
    // }

    return(
        <Typography>
            Dashboard {state.isAuth}
        </Typography>
    );

}