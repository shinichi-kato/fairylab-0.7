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

const useStyles = makeStyles(theme => ({
	root: {
		padding:theme.spacing(2),
		margin:theme.spacing(2),
		background:theme.palette.background.paper
	},
	items: {
		padding:theme.spacing(1),
		width: "95%",
	},
	listBox: {
		width: "85%",
		height: 200,
    maxHeight: 360,
    overflowY: "scroll",
	},
	listItem: {
	},
	textField: {
		width: "40%",
	},
	wideButton: {
		width: "100%",
		padding: 16,
	},
	avatar: {
		width: 80,
		height: 80
	},
	description:{
		width:"100%",
		height: 100,
	}

}));

export default function DownloadDialog(props){
	const classes = useStyles();
	const [botIndex,setBotIndex] = useState(null);
	const botList = props.botList;

	function handleClick(e,index){
		setBotIndex(index)
	}

	function handleDownload(){
		props.handleDownload(botList[botIndex])
	}
	

	const botItems = botList.length !== 0 ?
		botList.map((item,index)=>(
			<ListItem 
				className={classes.listItem}
				selected={botIndex===index}
				button onClick={e=>handleClick(e,index)}
			>
				<ListItemAvatar>
					<Avatar src={item.photoURL}/>
				</ListItemAvatar>
				<ListItemText>
					{item.id}
				</ListItemText>
			</ListItem>
		))
		:
		<ListItem>ボットが見つかりません</ListItem>;


	


	return (
		<Box className={classes.root} 
			display="flex"
			flexDirection="column"
			alignItems="center"
			borderRadius={10}
		>
			<Box className={classes.items}>
				<Typography variant="h7
				">
					チャットボットを選んでください
				</Typography>
			</Box>
			<Box className={classes.items} alignSelf="center">
				{props.sorterSelector }
			</Box>
			<Box className={classes.listBox} alignSelf="center">
				<List dense={true} >
					{botItems}
				</List>
			</Box>
			<Box className={classes.items}
				display="flex"

				flexDirection="row"
			>
				<Box>
					<Avatar className={classes.avatar} 
					src={botIndex !== null ?

						botList[botIndex].photoURL : 
						'avatar/bot/blank.svg'} />
				</Box>
				<Box className={classes.description}>
					<Typography variant="subtitle2">作者：
						{botIndex !== null ?
						botList[botIndex].creatorName :
						 ''}
					</Typography>
					<Typography variant="body1">
						{botIndex !== null ? 
						botList[botIndex].description : 
						''}
					</Typography>

				</Box>
				
			</Box>

			<Box className={classes.items} alignSelf="center">
				{props.message}
				<Button 
					className={classes.wideButton} 
					size="large"
					disabled = {botIndex === null}
					variant={botIndex!==null ? "contained" : "default"}
					color={botIndex!==null ? "primary" : "default"}
					onClick={handleDownload}>
					ダウンロード
				</Button>
			{!props.required && 
					<Button
						className={classes.wideButton}
						size="large"

						onClick={e=>props.handleClose()}
					>
						キャンセル
					</Button>
				}
				</Box>
		</Box>
	)
}