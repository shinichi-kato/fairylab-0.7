import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';


import MoreVert from '@material-ui/icons/MoreVert';

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

  function handleChangePage(page){
    handleClose();
    props.handleChangePage(page);
  }

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
      <Paper className={classes.root}>
        <Box display="flex" flexDirection="column">
          <Box>
            <Button className={classes.wideButton}
              onClick={e=>handleChangePage('UserSettings')}
            >
              ユーザ設定の変更
            </Button>
          </Box>
          <Box>
            <Button className={classes.wideButton}
              onClick={e=>handleChangePage('ScriptEditor')}
            >
              チャットボット辞書の編集
            </Button>
          </Box>
          <Box>
            <Button className={classes.wideButton}
              onClick={e=>handleChangePage('BotDownload')}
            >
              チャットボットのダウンロード
            </Button>
          </Box>
          <Box>
            <Typography variant="subtitle1">ver {version}</Typography>
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
        handleChangePage={props.handleChangePage}
      />

    </>
  )
}
