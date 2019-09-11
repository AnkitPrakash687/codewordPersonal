import React, { useState, Component, useEffect } from 'react';
import { green, lightGreen, red, grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import API from '../../utils/API'
import {List, ListItem, ListItemText, Chip, Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 20,
        flexGrow: 1,
        //  background: theme.palette.background.paper,
        background: lightGreen[200],
        minHeight: 500

    }, paper: {
        borderRadius: 5,
       margin: theme.spacing(1),
       padding: theme.spacing(1)
    },
    chip:{
        margin: theme.spacing(1)
    }
}));

export default function ReportCard(props) {
    const classes = useStyles();
   // const [codewords, setCodewords] = useState(props.items)
    const [chipData, setChipData] = React.useState(
        props.items.map((item, index)=>{
            return ({key: index, label: item})
        })
    )
    useEffect(()=>{
      //  console.log('***prop***')
        console.log(props.items)
        
    })

 const handleDelete = chip => () =>{
   console.log(chip.key)
 }   
    return(
        <List dense={true}>

            <Paper className={classes.paper}>
          {
              chipData.map((item)=>(                       
                  <Chip
                  key={item.key}
                label={item.label}
                size="small"
                className={classes.chip}
                color="primary"
                variant="outlined"
                onDelete = {handleDelete(item)}
            /> ))
          }
      </Paper>
        </List>
    )
}

