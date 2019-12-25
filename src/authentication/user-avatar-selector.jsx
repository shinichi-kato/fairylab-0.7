import React ,{useState} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const RE_FILENAME=/[\w-]+\.svg$/;

const avatarsDir = 'avatar/user/';
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
	currentAvatar: {
		margin: 2,
		width: 60,
		height: 60,
		backgroundColor: theme.palette.primary.main,
	},
}));

export default function UserIconSelector(props){
	const classes=useStyles();
	let userAvatar= props.value || avatarDir+avatarPaths[0];

	function handleSelectAvatar(img){
		setUserAvatar(img);
	}
	

	const avatarItems = avatarPaths.map((img) =>
		<IconButton className={classes.avatarButton} aria-label={img} key={img}
		onClick={(e) => handleSelectAvatar(img)}>
			<Avatar
				src={img}
				className={
					img === userAvatar ? classes.currentAvatar : classes.avatar}
			/>
		</IconButton>
	);

	return({avatarItems})
}