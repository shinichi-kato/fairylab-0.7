import React, {useState} from 'react';
import { makeStyles,createStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { botAvatarList} from '../biome-bot/bot-avatar-list.jsx';

const useStyles = makeStyles(theme => createStyles({
  avatar: {
    width: 50,
    height: 50
  },
  currentAvatar: {
    width: 50,
    height: 50,
    backgroundColor: theme.palette.primary.main,
  },
  diplayAvatar: {
    width: 40,
    height: 40   
  },
  window: {
    padding: theme.spacing(2),
  }

}));

export default function AvatarSelector(props){
  const classes = useStyles();
  const avatar = props.avatar;
  const [anchorEl,setAnchorEl] = useState(null);

  function handleClick(event){
    setAnchorEl(event.currentTarget);
  }

  function handleClose(){
    setAnchorEl(null);
  }

  function changeAvatar(path){
    setAnchorEl(null);
    props.changeAvatar(path);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'icon-popover' : undefined;


  return(
    <>
    <Button 
      aria-describedby={id}
      onClick={handleClick}>
      <Avatar className={classes.displayAvatar}
      src={avatar} />
      <ExpandMoreIcon />
    </Button>
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{vertical: 'bottom',horizontal:'center'}}
      transformOrigin={{vertical:'top',horizontal:'center'}}>

      <Paper
        className={classes.window}
      >
        {botAvatarList.map(path=>(
          <IconButton 
            size="small"
            onClick={()=>changeAvatar(path)}
          >
            <Avatar
              className={path === avatar ? classes.currentAvatar : classes.avatar}
              src={path} />
          </IconButton>
        ))}         
      </Paper>
    </Popover>
    </>
  )

}