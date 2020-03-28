import React ,{useState} from 'react';
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import EditIcon from '@material-ui/icons/Edit';

import DictSizeProgress from './dict-size-progress.jsx';

const useStyles = makeStyles(theme => createStyles({
  root:{
    backgroundColor:"#e0e0e0",
    width: "100%",
    
  },
  cell:{
    padding: theme.spacing(1)
  }

}));

export default function MemoryCard(props){
  const classes = useStyles();

  return (
    <Box display="flex"
      flexDirection="row"
      alignItems="center"
      className={classes.root}
    >
      <Box className={classes.cell}>
        <Typography variant="body2">
           ことば辞書
        </Typography>
      </Box>
      <Box className={classes.cell} flexGrow={1}>
        <DictSizeProgress size={props.size}/>
      </Box>
      <Box className={classes.cell}>
        <IconButton onClick={props.handleEditMemory}>
          <EditIcon />
        </IconButton>
      </Box>
    </Box>
  )
}