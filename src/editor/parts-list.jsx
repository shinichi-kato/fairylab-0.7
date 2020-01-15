import React ,{useState} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => createStyles({
	root: {
    backgroundColor:theme.palette.background.paper,
		padding: theme.spacing(2),
	},
	textField: {
		padding: "2px 4px",
		backgroundColor:theme.palette.background.paper,

	},
	readOnlyField:{
		padding: theme.spacing(1),
		backgroundColor:"#e0e0e0",	
	}
}));

function PartCard(props){
  return(
    <Card>
      
    </Card>
  )
}

export default function PartsList(props){
  const classes=useStyles();
  const partItems = props.parts.map(part=>(
    <Paper className={classes.root}>
      {part}
    </Paper>
  ));

  return (
    <>
      {partItems}
    </>
  )
}