import React,{useState,useReducer,useContext} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import {BotContext} from '../biome-bot/bot-provider.jsx';

function toTimestampString(d){
	return	`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.toLocaleTimeString()}`;
}

const useStyles = makeStyles(theme => createStyles({
	root: {
		flexGrow: 1,
		padding: theme.spacing(2),
	},
	textField: {
		padding: 2,
		backgroundColor:theme.palette.background.paper,

	},
	readOnlyField:{
		padding: theme.spacing(1),
		backgroundColor:"#e0e0e0",	
	}
}));

function initialState(botSettings){
	return {
		...botSettings
		// id : settings.id,
		// displayName : settings.displayName,
		// photoURL : settings.photoURL,
		// creatorUID : settings.creatorUID,
		// creatorName : settings.creatorName,
		// timestamp : settings.timestamp,
		// published : settings.published,
		// parts : settings.parts,
		// memory : settings.memory,
		// partContext: [...settings.partContext],
	}
}

function reducer(state,action){
	switch(action.type){

		case 'changeId' : {
			return {
				...state,
				id:action.id,
				published : false,
			}
		}
		
		case 'changeDisplayName' :{
			return {
				...state,
				displayName : action.displayName,
			}
		}

		case 'changePhotoURL':{
			return {
				...state,
				photoURL : action.photoURL,
			}
		}
		case 'changePartsOrder' : {
			return {
				...state,
				parts:[...action.parts],
			}
		}
		case 'setPublished' : {
			return {
				...state,
				published : action.published,
			}
		}
		default : 
			throw new Error(`invalid action ${action.type}`);
	}
}

export default function ScriptEditor(props){
	const classes = useStyles();
	const bot = useContext(BotContext);
	const [state,dispatch] = useReducer(reducer,initialState(bot.state));

	console.log("state=",bot.state)
	return (
		<Grid container
		 className={classes.root}
		 spacing={1}
		 alignContent="flex-start">
			<Grid item xs={6}>
				<Typography 
					variant="subtitle2">
				チャットボットの名前
				</Typography>
				<Paper className={classes.textField}>
					<InputBase 
						id="displayName"
						placeholder="例：ぽち"
						fullWidth
						value={state.displayName}
						onChange={e=>dispatch({
							type:'changeDisplayName',
							displayName:e.target.value})}
					/>
				</Paper>
			</Grid>
			<Grid item xs={6}>
				<Typography variant="subtitle2">
					チャットボットの公開状態
				</Typography>
				<ButtonGroup aria-label="publish">
					<Button
						variant={state.published ? "contained" : "outlined"}
						color={state.published ? "primary" : "default"}
						onClick={e=>dispatch({type:"setPublished",published:true})}
					>
						プライベート
					</Button>
					<Button
						variant={!state.published ? "contained" : "outlined"}
						color={!state.published ? "primary" : "default"}
						onClick={e=>dispatch({type:"setPublished",published:false})}
					>
						シェア
					</Button>
				</ButtonGroup>
			</Grid>
			<Grid item xs={12}>
			<Typography 
					variant="subtitle2">
				チャットボットのid
				</Typography>
				<Paper className={classes.textField}>
					<InputBase 
						id="id"
						placeholder="例：HelloBot-1.0.2"
						fullWidth
						value={state.id}
						onChange={e=>dispatch({
							type:'changeId',
							id:e.target.value})}
					/>
				</Paper>
			</Grid>
			<Grid item xs={6}>
				<Typography variant="subtitle2">
					作者名
				</Typography>
				<Paper className={classes.readOnlyField}>
					{state.creatorName}
				</Paper>				
			</Grid>
			<Grid item xs={6}>
				<Typography variant="subtitle2">
					最終アップロード
				</Typography>
				<Paper className={classes.readOnlyField}>
					{toTimestampString(state.timestamp.toDate())}
				</Paper>										
			</Grid>
			<Grid item xs={12}>
				<Typography variant="subtitle2">
					概要
				</Typography>
				<Paper className={classes.textField}>
					<InputBase 
						id="description"
						placeholder="例：このボットは挨拶を返します"
						fullWidth
						multiline
						rows={5}
						value={state.description}
						onChange={e=>dispatch({
							type:'changeDescription',
							displayName:e.target.value})}
					/>
				</Paper>
			</Grid>
		</Grid>
	)
}