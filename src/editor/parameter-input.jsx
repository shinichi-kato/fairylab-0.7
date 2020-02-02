import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => createStyles({
	textField: {
		padding: "2px 4px",
		backgroundColor:"#E0E0E0",

  },
  textFieldError: {
    padding: "2px 4px",
		backgroundColor:"#E0c0c0",
  },
}));

export default function ParameterInput(props) {
  const classes = useStyles();



  return (
    <>
      <Paper className={
        props.error ? 
        classes.textFieldError : classes.textField}>
        
        <InputBase 
          id={props.parameterId}
          placeholder="例：0.20"
          fullWidth
          value={props.value}
          onChange={props.handleChangeValue}
        />
      </Paper>
      <Typography variant="body2"
        color={props.error ? "error" : "initial"}
      >
        {props.error ? "無効な値です" : props.caption}
      </Typography>
    </>
  )

}