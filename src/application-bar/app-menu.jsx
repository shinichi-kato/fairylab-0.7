import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';


import MoreVert from '@material-ui/icons/MoreVert';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Warning from '@material-ui/icons/Warning';
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';

import {version} from '../../package.json';

const useStyles = makeStyles(theme => ({
  root: {
    padding:theme.spacing(1,0.5),
    width: 320,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "80%",
  },
  button: {
    margin: theme.spacing(1),
  },
  wideButton: {
    width: "100%",
  }
}));

function AppMenuDialog(props){
  const classes = useStyles();
  const {id,anchorEl,open,handleClose} = props; 
  console.log(props.pageHandlers);
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Paper className={classes.roor}>
        <Box display="flex" flexDirection="column">
          <Box>
            <Button className={classes.wideButton}
              
            >
              ユーザ設定の変更
            </Button>
          </Box>
          <Box>
            <Button className={classes.wideButton}
              onClick={e=>props.pageHandlers['ScriptEditor']}
            >
              チャットボット辞書の編集
            </Button>
          </Box>
        </Box>
      </Paper>
    </Popover>
  )
}

export default function AppMenu(props){
  const [anchorEl,setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'anchor-popover' : undefined;

  function handleClick(event){
    setAnchorEl(event.currentTarget);
  }

  function handleClose(){
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        aria-describedby={id}
        variant="contained" 
        onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <AppMenuDialog 
        id={id}
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
        pageHandlers={props.pageHandlers}
      />

    </>
  )
}
