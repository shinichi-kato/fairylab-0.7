import React,{useState,useReducer,useContext} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import DictTableEditor from './dict-table-editor.jsx';
import DictJsonEditor from './dict-json-editor.jsx';

import {getStrByteSize} from '../biome-bot/getStrByteSize.jsx';

const typeNames=[
  {id:'sensor',label:'センサー'},
];

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
  },
  dictCaption:{
    padding:theme.spacing(1),
  }
}));


function initialState(name,context){
  return {
    name:name,
    type:context.type,
    availability:context.availability,
    sensitivity:context.sensitivity,
    retention:context.retention,
    _isNameChanged:false,
    _originalName:name,  // nameが変わったら親のpartsも書き換える
  }
}

function reducer(state,action){
  switch(action.type){
    case 'changeName' :{
      return {
        ...state,
        name:action.name,
        _isNameChanged:true,
      }
    }
    
    case 'changeType' :{
      return {
        ...state,
        type:action.type,
      }
    }

    case 'changeAvailability':{
      return {
        ...state,
        availability:action.availability,
      }
    }

    case 'changeSensitivity':{
      return {
        ...state,
        sensitivity:action.sensitivity,
      }
    }

    case 'changeRetention':{
      return {
        ...state,
        retention:action.retention,
      }
    }
    default : 
			throw new Error(`invalid action ${action.type}`);
  }
}

export default function PartEditor(props){
  const classes = useStyles();
  const {name,context} =props;
  const [state,dispatch] = useReducer(reducer,initialState(name,context))
  const [editorMode,setEditorMode] = useState(true);
  
  

  function handleUpdate(dictSource){
    props.handleUpdatePart(name,{
      type:state.type,
      availability:state.availability,
      sensitivity: state.sensitivity,
      retention: state.retention,
      _isNameChanged:state.isNameChange,
      _originalName:state.originalName,
      dictSource:dictSource,
      _dictSourceByteSize:getStrByteSize(dictSource),
    });
  }

  return (
		<Grid container
		  className={classes.root}
		  spacing={1}
		  alignContent="flex-start">
      
      <Grid item xs={12}>
        <Typography variant="body2">パートの名前</Typography>
        <Paper className={classes.textField}>
					<InputBase 
						id="name"
						placeholder="例：Part-1"
						fullWidth
						value={state.name}
						onChange={e=>dispatch({
							type:'changeName',
							name:e.target.value})}
					/>
				</Paper>

      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">
            起動率 (0〜1.00)
          </Typography>
          <Paper className={classes.textField}>
            <InputBase 
              id="availability"
              placeholder="例：0.20"
              fullWidth
              value={state.availability}
              onChange={e=>dispatch({
                type:'changeAvailability',
                availability:e.target.value})}
            />
          </Paper>
          <Typography variant="caption">
            パートはこの確率で実行される
          </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">
            感度 (0〜1.00)
          </Typography>
          <Paper className={classes.textField}>
            <InputBase 
              id="sensitivity"
              placeholder="例：0.20"
              fullWidth
              value={state.sensitivity}
              onChange={e=>dispatch({
                type:'changeSensitivity',
                sensitivity:e.target.value})}
            />
          </Paper>
          <Typography variant="caption">
            入力の類似度がこの値を下回ると不一致とみなす
          </Typography>
      </Grid>      
      <Grid item xs={4}>
        <Typography variant="body2">
            継続率 (0〜1.00)
          </Typography>
          <Paper className={classes.textField}>
            <InputBase 
              id="retention"
              placeholder="例：0.20"
              fullWidth
              value={state.retention}
              onChange={e=>dispatch({
                type:'changeRetention',
                retention:e.target.value})}
            />
          </Paper>
          <Typography variant="caption">
            この確率で次回もこのパートが実行される
          </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex"
          flexDirection="row"
          className={classes.dictCaption}
          >
          <Box alignSelf="center">
          <Typography variant="body2">
            辞書
          </Typography>
          </Box>
          <Box alignSelf="center">
            <ButtonGroup aria-label="mode">
              <Button
                size="small"
                variant={editorMode ? "contained" : "outlined"}
                color={editorMode ? "primary" : "default"}
                onClick={e=>setEditorMode(true)}
              >
                エディタ
              </Button>
              <Button
                size="small"
                variant={editorMode ? "outlined" : "contained"}
                color={editorMode ? "default" : "primary"}
                onClick={e=>setEditorMode(false)}
              >
                JSON
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      </Grid>
      <Grid xs={12}>
        {editorMode ? 
            <DictJsonEditor 
              dict={context.dictSource}
              handleUpdate={handleUpdate}
            />
            :
            <DictJsonEditor
              dict={context.dictSource}
              handleUpdate={handleUpdate}
            />
          }
      </Grid>


    </Grid>
  )
}