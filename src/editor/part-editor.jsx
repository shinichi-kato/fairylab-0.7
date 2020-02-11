import React,{useState,useReducer} from 'react';
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
import ParameterInput from './parameter-input.jsx';
import {getStrByteSize} from '../biome-bot/getStrByteSize.jsx';



const typeNames=[
  {id:'sensor',label:'センサー'},
];

const useStyles = makeStyles(theme => createStyles({
	root: {
		flexGrow: 1,
    padding: theme.spacing(2),
    height:'calc( 100vh - 64px - 48px  )',
    overflowY:'scroll',
    overscrollBehavior:'auto',
    WebkitOverflowScrolling:'touch',
	},
	caption: {
		
	},
	textField: {
		padding: "2px 4px",
		backgroundColor:"#E0E0E0",

  },
  textFieldError: {
    padding: "2px 4px",
		backgroundColor:"#E0c0c0",
   
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
  },

}));


function initialState(name,context){
  return {
    name:name,
    type:context.type,
    availability:context.availability,
    generosity:context.generosity,
    retention:context.retention,
    _error: {
      availablity:false,
      generosity:false,
      retention:false,
      name:false,
    },
    _isNameChanged:false,
    _originalName:name,  // nameが変わったら親のpartsも書き換える
  }
}

function reducer(state,action){
  switch(action.type){
    case 'changeName' :{
      const isError = state._originalName!==action.name && action.name in action.parts;
      return {
        ...state,
        name:action.name,
        _isNameChanged:true,
        _error:{
          ...state._error,
          name:isError,
        }
      }
    }
    
    case 'changeType' :{
      return {
        ...state,
        type:action.type,
      }
    }

    case 'changeAvailability':{
      const value = parseFloat(action.availability);
      const isError = value<0 || 1<value;

      return{
        ...state,
        availability:action.availability,
        _error:{
          ...state._error,
          availability:isError
        }
      }
    }

    case 'changeGenerosity':{
      const value = parseFloat(action.generosity);
      const isError = value<0 || 1<value;

      return{
        ...state,
        generosity:action.generosity,
        _error:{
          ...state._error,
          generosity:isError
        }
      }
    }

    case 'changeRetention':{
      const value = parseFloat(action.retention);
      const isError = value<0 || 1<value;

      return{
        ...state,
        retention:action.retention,
        _error:{
          ...state._error,
          retention:isError
        }
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
  
  const isInvalid = state._error.availability || state._error.generosity || state._error.retention;

  function handleUpdate(dictSource){
    props.handleUpdatePart(name,{
      name:state.name,
      type:state.type,
      availability:state.availability,
      generosity: state.generosity,
      retention: state.retention,
      _isNameChanged:state._isNameChanged,
      _originalName:state._originalName,
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
        <Typography variant="body2"
          color={state._error.name ? "error" : "initial"}
        >
          { state._error.name ? "パートの名前が他と重複しています" : "パートの名前"}
        </Typography>
        <Paper className={ state._error.name ? classes.textFieldError : classes.textField}
        >
					<InputBase 
						id="name"
						placeholder="例：Part-1"
						fullWidth
						value={state.name}
						onChange={e=>dispatch({
              type:'changeName',
              parts:props.parts,
							name:e.target.value})}
					/>
				</Paper>

      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">
            起動率A (0〜1.00)
        </Typography>
        <ParameterInput 
          parameterId="availability"
          caption="パートはA%の確率で実行される"
          error={state._error.availability}
          value={state.availability}
          handleChangeValue={e=>dispatch({
            type:'changeAvailability',
            availability:e.target.value})}
        />
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">
            寛容性G (0〜1.00)
        </Typography>
        <ParameterInput 
        parameterId="generosity"
        caption="入力の類似度がGを下回ると不一致とみなす"
        error={state._error.generosity}
        value={state.generosity}
        handleChangeValue={e=>dispatch({
          type:'changeGenerosity',
          generosity:e.target.value})}
        />
    </Grid>      
      <Grid item xs={4}>
        <Typography variant="body2">
            継続率R (0〜1.00)
        </Typography>
        <ParameterInput 
        parameterId="retention"
        caption="次もR%でこのパートから実行"
        error={state._error.retention}
        value={state.retention}
        handleChangeValue={e=>dispatch({
          type:'changeRetention',
          retention:e.target.value})}
        />

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
                表入力
              </Button>
              <Button
                size="small"
                variant={editorMode ? "outlined" : "contained"}
                color={editorMode ? "default" : "primary"}
                onClick={e=>setEditorMode(false)}
              >
                エディタ
              </Button>
            </ButtonGroup>
            <Button>
              書き方
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid xs={12}>
        {editorMode ? 
            <DictJsonEditor 
              dict={context.dictSource}
              name={props.name}
              updateDisabled={isInvalid}
              handleUpdate={handleUpdate}
              handleCheckDictSource={props.handleCheckDictSource}
            />
            :
            <DictJsonEditor
              dict={context.dictSource}
              updateDisabled={isInvalid}
              handleUpdate={handleUpdate}
            />
          }
      </Grid>


    </Grid>
  )
}