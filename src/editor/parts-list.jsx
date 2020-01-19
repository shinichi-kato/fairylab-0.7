import React ,{useState} from 'react';
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';


const fireStoreByteMaxSize = 1048487;
const sizeDisplayFactor = 100 / Math.sqrt(fireStoreByteMaxSize);

function dictSizeScale(size){
  /*
    辞書のサイズを0-100でprogressバーに表示するための換算。
    サイズはsqrtスケールとし、fireStoreのバイト型が
    最大 1,048,487 バイト（1 MiB～89 バイト）
    であるため、これが100となるように換算する。
    つまり    
    value={Math.sqrt(size)/Math.sqrt(fireStoreByteMaxSize)*100
    となる
  */
    return Math.sqrt(size)*sizeDisplayFactor;
}



const useStyles = makeStyles(theme => createStyles({
	root: {
    height: 360,
    maxHeight: 500,
    overflowY: "scroll",
	},
	textField: {
		padding: "2px 4px",
		backgroundColor:theme.palette.background.paper,

	},
	readOnlyField:{
		padding: theme.spacing(1),
		backgroundColor:"#e0e0e0",	
  },
  part:{
    backgroundColor:"#e0e0e0",
    width: "100%",
    
  },
  caption:{
    opacity:0.4,
  },
  progress:{
    width: 120,
    padding: theme.spacing(1),
  },
  newPart:{
    border: "dashed 4px #cccccc",
    width: "95%",
  }

}));


const DictSizeProgress = withStyles({
  root: {
    height: 14,
    backgroundColor: '#999999',
    borderRadius: 6,
  },
  bar: {
    backgroundColor: '#2e7d32',
    borderRadius: 6,
  }
})(LinearProgress);

const ParameterTooltip = withStyles({
  tooltip:{
    fontSize: 14,
  }
})(Tooltip);


function PartCard(props){
  const {name,_dictByteSize,index} = props;
  const classes = useStyles();

  return(
    <ListItem key={name}>
      <Box display="flex"
        flexDirection="row"
        className={classes.part}
        key={name}
        >
          <Box alignSelf="center">
            <IconButton
              size="small"
              onClick={e=>props.handleRaisePart(index)}
            >
              <ArrowUpwardIcon/>
            </IconButton>
            <IconButton
              size="small"
              onClick={e=>props.handleDropPart(index)}
            >
              <ArrowDownwardIcon/>
            </IconButton>
          </Box>
          <Box 
            flexGrow={1} 
            display="flex" 
            flexDirection="column"
          >
            <Box className={classes.progress}>
              {name}
            </Box>
            <Box display="flex" flexDirection="row">
              <Box>
                辞書
              </Box>
              <Box className={classes.progress}>
                <ParameterTooltip 
                  title={`${_dictByteSize.toFixed(2)} バイト`} 
                  arrow>
                  <DictSizeProgress 
                    variant="determinate"
                    value={dictSizeScale(_dictByteSize)}
                  />
                </ParameterTooltip>
              </Box>
            </Box>
          </Box>
          <Box alignSelf="center">
            <IconButton 
              onClick={e=>props.handleEditPart(name)}
              size="small">
              <EditIcon/>
            </IconButton>
            <IconButton
              size="small">
              <DeleteIcon/>
            </IconButton>
          </Box>
      </Box>
    </ListItem>
  )
}


function NewPartCard(props){
  const classes=useStyles();

  return (
    <ListItem key="__new__">
      <Box display="flex"
        flexDirection="row"
        justifyContent="center"
        className={classes.newPart}
        alignSelf="center">
        <Box alignSelf="center">
          <Button
            size="large"
            onClick={props.handleAddPart}
          >
            <AddIcon/>パートを追加
          </Button>
        </Box>
      </Box>
    </ListItem>

  )
}

export default function PartsList(props){
  const classes=useStyles();
  const {parts,partContext} = props;
  const partItems = parts.map((part,index)=>(
    <PartCard index={index} name={part} {...partContext[part]}
      handleRaisePart={props.handleRaisePart}
      handleDropPart={props.handleDropPart}
      handleEditPart={props.handleEditPart}
    />
  ));

  return (
    <List className={classes.root}>
      {partItems}
      <NewPartCard handleAddPart={props.handleAddPart}/>
    </List>
  )
}