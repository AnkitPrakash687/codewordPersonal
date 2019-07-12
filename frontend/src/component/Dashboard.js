import Typography from '@material-ui/core/Typography';
import React, {useState} from 'react';
export default function Dashboard(props) {

    const [state, setState] = useState({
        isAuth: 'Auth: '+ props.isAuth
      })
    return(
        <Typography>
            Dashboard {state.isAuth}
        </Typography>
    );

}