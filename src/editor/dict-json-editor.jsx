import React,{useState} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';

import {checkDictStructure} from '../biome-bot/part.jsx';

const useStyles = makeStyles(theme => createStyles({
	root: {
		flexGrow: 1,
		padding: theme.spacing(2),
	},
	item: {
		pading: theme.spacing(2),
	},
	textField: {
		padding: "2px 4px",
		backgroundColor:"#E0E0E0",

	},
	readOnlyField:{
		padding: theme.spacing(1),
		backgroundColor:"#C0C0C0",	
	},
	middleButton:{
		width: "70%",
	}
}));

export default function DictJsonEditor(props){
  const classes = useStyles();
  const [dict,setDict] = useState(props.dict)
  const [message,setMessage] = useState(null);

  function handleCheckDictStructure(){
    const result = checkDictStructure(dict);
    setMessage(result.error);
  }

  return (
    <Box display="flex" flexDirection="column">
      <Box className={classes.item}>
        <Paper className={classes.textField}>
        <InputBase 
          id="displayName"
          placeholder="例：[[[&quote;こんにちは&quote;],[&quote;よろしく！\&quote;],[[&quote;&quote;],[&quote;&quote;]]]"
          fullWidth
          multiline
          rows={22}
          value={dict}
          onChange={e=>setDict(e.target.value)}
        />
        </Paper>   
        {message} 
      </Box>  
      <Box className={classes.item}>
        <Button 
          className={classes.middleButton}
          size="large"
          variant="contained"
          color="primary"
          disabled = {props.updateDisabled}
          onClick={e=>props.handleUpdate(dict)}>
          OK
        </Button>
        <Button onClick={handleCheckDictStructure}>
          文法チェック
        </Button>
      </Box>    
    </Box>

  )
}
