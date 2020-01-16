import React ,{useState} from 'react';
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';


const partTypeIcons={
  'sensor':<Tooltip title="sensor"></Tooltip>,
}



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
  },
  part:{
    backgroundColor:"#e0e0e0",
    width: "100%",
    marginBottom: theme.spacing(1),
  },
  caption:{
    opacity:0.4,
  },
  progress:{
    width: 80,
    padding: theme.spacing(1),
  },
  newPart:{
    border: "dashed 4px #cccccc",
    width: "100%",
  }

}));

const AvailabilityProgress = withStyles({
  root: {
    height: 14,
    backgroundColor: '#999999',
    borderRadius: 6,
  },
  bar: {
    backgroundColor: '#01579b',
    borderRadius: 6,
  }
})(LinearProgress);

const TriggerLevelProgress = withStyles({
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

const RetentionProgress = withStyles({
  root: {
    height: 14,
    backgroundColor: '#999999',
    borderRadius: 6,
  },
  bar: {
    backgroundColor: '#d84315',
    borderRadius: 6,
  }
})(LinearProgress);

const ParameterTooltip = withStyles({
  tooltip:{
    fontSize: 14,
  }
})(Tooltip);


function PartCard(props){
  const {name,availability,triggerLevel,retention,index} = props;
  const classes = useStyles();

  return(
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
            <Box className={classes.progress}>
              <ParameterTooltip 
                title={`稼働率(${availability.toFixed(2)})`} 
                arrow>
                <AvailabilityProgress 
                  variant="determinate"
                  value={availability*100}
                />
              </ParameterTooltip>
            </Box>
            <Box className={classes.progress}>
              <ParameterTooltip 
                title={`トリガーレベル(${triggerLevel.toFixed(2)})`} 
                arrow>
                <TriggerLevelProgress
                  variant="determinate" value={triggerLevel*100}
                />
              </ParameterTooltip>
            </Box>
             <Box className={classes.progress}>
                <ParameterTooltip 
                  title={`維持率(${retention.toFixed(2)})`} 
                  arrow>
                  <RetentionProgress 
                    variant="determinate" value={retention*100}
                  />
                </ParameterTooltip>
            </Box>
          </Box>
        </Box>
        <Box alignSelf="center">
          <IconButton 
            size="small">
            <EditIcon/>
          </IconButton>
          <IconButton
            size="small">
            <DeleteIcon/>
          </IconButton>
        </Box>
    </Box>
  )
}


function NewPartCard(props){
  const classes=useStyles();

  return (
    <Box display="flex"
      flexDirection="row"
      justifyContent="center"
      className={classes.newPart}>
      <Box alignSelf="center">
        <Button
          size="large"
          onClick={props.handleAddPart}
        >
          <AddIcon/>パートを追加
        </Button>
      </Box>
    </Box>
  )
}

export default function PartsList(props){
  const {parts,partContext} = props;
  const partItems = parts.map((part,index)=>(
    <PartCard index={index} name={part} {...partContext[part]}
      handleRaisePart={props.handleRaisePart}
      handleDropPart={props.handleDropPart}
    />
  ));

  return (
    <Box display="flex" flexDirection="column">
      {partItems}
      <NewPartCard handleAddPart={props.handleAddPart}/>
    </Box>
  )
}