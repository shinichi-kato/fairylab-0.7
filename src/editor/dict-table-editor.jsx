import React,{useState} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';

const useStyles = makeStyles(theme => createStyles({
	root: {
		flexGrow: 1,
		padding: theme.spacing(2),
	},
	caption: {
		
	},
	textField: {
		padding: "2px 4px",
		backgroundColor:"#E0E0E0",

	},
	readOnlyField:{
		padding: theme.spacing(1),
		backgroundColor:"#C0C0C0",	
	},
	wideButton:{
		width: "100%",
	}
}));

export default function DictTableEditor(props){
  const classes = useStyles();
  const [dict,setDict] = useState(props.dict);

  return (
    <Paper className={classes.textField}>
      <InputBase 
        id="displayName"
        placeholder="例：ぽち"
        fullWidth
        rows={14}
        value={dict}
        onChange={e=>setDict(e.target.value)}
      />
    </Paper>
  )
}