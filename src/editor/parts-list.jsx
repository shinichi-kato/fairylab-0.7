import React ,{useState} from 'react';
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';

import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';





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
  card:{
    backgroundColor:"#e0e0e0",
    width: "100%",
  },
  caption:{
    opacity:0.4,
  },
  progress:{
    width: 80,
    padding: theme.spacing(1),
  },

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
  const classes = useStyles();
  return(
    <Box display="flex"
      flexDirection="row"
      className={classes.card}>
        <Box alignSelf="center">
          <IconButton
            size="small"
          >
            <ArrowUpwardIcon/>
          </IconButton>
          <IconButton
            size="small"
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
            {props.name}
          </Box>
          <Box display="flex" flexDirection="row">
            <Box className={classes.progress}>
              <ParameterTooltip title="稼働率" arrow>
                <AvailabilityProgress 
                  variant="determinate"
                  value={50}
                />
              </ParameterTooltip>
            </Box>
            <Box className={classes.progress}>
              <ParameterTooltip title="トリガーレベル" arrow>
                <TriggerLevelProgress
                  variant="determinate" value={10}
                />
              </ParameterTooltip>
            </Box>
             <Box className={classes.progress}>
                <ParameterTooltip title="維持率" arrow>
                  <RetentionProgress 
                    variant="determinate" value={20}
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

export default function PartsList(props){
  const classes=useStyles();
  const partItems = props.parts.map(part=>(
    <PartCard name={part} />
  ));

  return (
    <Box display="flex" flexDirection="column">
      {partItems}
    </Box>
  )
}