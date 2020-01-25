import React,{useState} from 'react';
import { makeStyles,createStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

import { botAvatarList} from '../biome-bot/bot-avatar-list.jsx';

const useStyles = makeStyles(theme => createStyles({
  avatar: {
    width: 40,
    height: 40
  },
  currentAvatar: {
    width: 40,
    height: 40,
    backgroundColor: theme.palette.primary.main,
  }
}));


export default function AvatarSelector(props){
  const classes = useStyles();
  const avatar = props.avatar;
  console.log("avatar=",avatar);
  return (
    <>
    {botAvatarList.map(path=>(
      <IconButton 
        size="small"
        onClick={()=>props.changeAvatar(path)}
      >
        <Avatar
          className={path === avatar ? classes.currentAvatar : classes.avatar}
          src={path} />
      </IconButton>
    ))}
    </>  
  )
}

