import React,{useState} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';

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

  function promiseCheckDictStructure(name,dict){
    return new Promise((resolve,reject)=>{
      resolve(
        checkDictStructure(name,dict)
      );
    });
  }

  
  function handleChangeDict(dict){
    // いずれpromiseに改修のこと
    setDict(dict);
    setMessage("チェック中...")
    promiseCheckDictStructure(props.name,dict)
    .then(result=>{
      setMessage(result.error);
    })
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
          onChange={e=>handleChangeDict(e.target.value)}
        />
        </Paper>   
        {
          message === null ?
          <Typography variant="caption">エラーはありません</Typography>
          :
          <Typography variant="caption" color="error">{message}</Typography>
        }
      </Box>  
      <Box className={classes.item}>
        <Button 
          className={classes.middleButton}
          size="large"
          variant="contained"
          color="primary"
          disabled = {props.updateDisabled || message !== null}
          onClick={e=>props.handleUpdate(dict)}>
          OK
        </Button>
        
      </Box>    
    </Box>

  )
}
