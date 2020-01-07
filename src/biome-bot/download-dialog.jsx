import React ,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import SorterSelector from './sorter-selector.jsx';


const sorters = [
	'timestamp','name','dlCount'
];

const sorterLabel={
	'timestamp':'新着順',
  'name':'名前順',
	'dlCount':'DL数順'
};

const useStyles = makeStyles(theme => ({
	root: {
		padding:theme.spacing(2),
		margin:theme.spacing(2),
		background:theme.palette.background.paper
	},
	items: {
		padding:theme.spacing(1),
		width: "80%",
	},
	textField: {
		width: "40%",
	},
	wideButton: {
		width: "100%",
		padding: 16,
	},
}));

export default function DownloadDialog(props){
	const classes = useStyles();
	const [sortBy,setSortBy] = useState(sorters[0]);
	const [id,setId] = useState(null);

	function handleChangeSortBy(mode){
		setSortBy(mode);
	}

	function handleClick(e,id){
		setId(id)
	}

	const botItems = props.botList.map(item=>(
		<ListItem button onClick={e=>handleClick(e,item.id)}>
			<ListItemAvatar>
				<Avatar src={item.photoURL}/>
			</ListItemAvatar>
			<ListItemText>
				{item.id}
			</ListItemText>
		</ListItem>
	));

	return (
		<Box className={classes.root} 
			display="flex"
			flexDirection="column"
			alignItems="center"
			borderRadius={10}
		>
			<Box className={classes.items}>
				<Typography variant="h4">
					チャットボットを選んでください
				</Typography>
			</Box>
			<Box className={classes.items}
				display="flex"
				flexDirection="row"
			>
				<Box>
					<SorterSelector
						sorters={sorters}
						sorterLabel={sorterLabel}
						sortBy={sortBy}
						handleChangeSortBy={handleChangeSortBy}
					/>
				</Box>
				<Box>
					<List dense={true}>
						{botItems}
					</List>
				</Box>
				<Box>
					ここに選んだボットのavatarと名前
				</Box>
				<Box>
					{props.message}
					<Button>
						ダウンロード
					</Button>
				</Box>
			</Box>
		</Box>
	)
}