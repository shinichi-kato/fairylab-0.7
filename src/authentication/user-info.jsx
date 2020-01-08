import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import InputBase from '@material-ui/core/InputBase';

import PersonIcon from '@material-ui/icons/Person';

// const RE_FILENAME=/[\w-]+\.svg$/;

const avatarDir = 'avatar/user/';
const avatarPaths = [
	'0person.svg',
	'1boy.svg',
	'2girl.svg',
	'3girl.svg',
	'4boy.svg',
	'5girl.svg',
	'6corgi.svg',
	'7cow.svg',
	'8dino.svg',
	'9eleph.svg',
	'10fish.svg',
	'11ladybird.svg',
	'12panther.svg',
	'13lion.svg',
	'14panda.svg',
	'15unico.svg',
];

const useStyles = makeStyles(theme => createStyles({
	root: {
		padding: theme.spacing(2),
	},
	avatarButton: {
		margin: theme.spacing(0),
		padding: theme.spacing(0),
	},
	avatar: {
		margin: 10,
		width: 44,
		height: 44
  },
  input: {
    padding: theme.spacing(1),
    background:theme.palette.background.paper,
  },
	currentAvatar: {
		margin: 2,
		width: 60,
		height: 60,
		backgroundColor: theme.palette.primary.main,
	},
}));

export default function UserInfo(props){
  const classes = useStyles();
  let userAvatar= props.photoURL || avatarDir+avatarPaths[0];

  const avatarItems = avatarPaths.map(img =>
    <IconButton className={classes.avatarButton} aria-label={avatarDir+img} key={img}
      onClick={(e) => props.handleChangePhotoURL(avatarDir+img)}>
        <Avatar
          src={avatarDir+img}
          className={
            userAvatar === avatarDir+img ? classes.currentAvatar : classes.avatar}
        />
    </IconButton>
  );

 
  return (
    <>
      <Box
        className={classes.input} 
        borderRadius={3}>
        <InputBase 
          id="dispalyName"
          placeholder="ユーザの名前"
          startAdornment={ <PersonIcon /> }
          value={props.displayName}
          onChange={e=>{props.handleChangeDisplayName(e.target.value)}}
        />						
      </Box>
      <Box>
        {avatarItems}
      </Box>
    </>   
  )
}