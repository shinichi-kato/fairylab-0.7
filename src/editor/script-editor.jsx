import React,{useState,useReducer,useContext} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import UploadIcon from '@material-ui/icons/CloudUploadOutlined';
import SaveIcon from '@material-ui/icons/SaveAlt';

import PartsList from './parts-list.jsx';

import {BotContext} from '../biome-bot/bot-provider.jsx';
import {AuthContext} from '../authentication/auth-provider.jsx';

function toTimestampString(timestamp){
	/*
	 firebaseのTimestampはlocalStorageに保存されるときに
	　Timestamp(seconds=1578745004, nanoseconds=743000000)
	　という文字列に変換される。文字列からJavascriptのDate型を復元するため
		正規表現を利用する。

		firebaseのマニュアルではtoMillis()などが記載されているが、
		ToString()は共通なのでこれを利用
	
	*/ 
	const datestr = timestamp.toString();
	const r = datestr.match(/seconds=([0-9]+)/);
	// r = ["seconds=12453340","12453340"]
	let d = new Date(r[1]*1000);
	return	`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.toLocaleTimeString()}`;
}

const useStyles = makeStyles(theme => createStyles({
	root: {
		flexGrow: 1,
		padding: theme.spacing(2),
	},
	caption: {
		
	},
	textField: {
		padding: "2px 4px",
		backgroundColor:"#E0E0E0",

	},
	readOnlyField:{
		padding: theme.spacing(1),
		backgroundColor:"#C0C0C0",	
	},
	wideButton:{
		width: "100%",
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
				creatorName : action.user.displayName,
				creatorId: action.user.UID,
				likeCount: 0,
			}
		}
		
		case 'changeDisplayName' :{
			return {
				...state,
				displayName : action.displayName,
				likeCount: 0,
			}
		}

		case 'changePhotoURL':{
			return {
				...state,
				photoURL : action.photoURL,
				creatorName : action.user.displayName,
				creatorId: action.user.UID,				
				likeCount: 0,
			}
		}
		case 'changeDescription':{
			return {
				...state,
				description:action.description,
				creatorName : action.user.displayName,
				creatorId: action.user.UID,					
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
		
		case 'appendNewPart' : {
			// 新しく使われていないパート名を生成
			// partsに現れる数値の最大値+1
			const partstr = state.parts.join(',');
			const nums = partstr.match(/[0-9]+/g) || [0];
			const max = Math.max.apply(null,nums);
			const newPartName=`Part-${max+1}`;

			return {
				...state,
				parts:[...state.parts,newPartName],
				partContext:{
					...state.partContext,
					[newPartName]:{
						type:"sensor",
						availability: 1.0,
						triggerLevel: 0.01,
						retention: 0.9,
						dict:[],
					}
				}
			}
		}

		case 'raisePart':{
			const i = action.index
			if(i === 0){ return state; }
			
			// index-1番目とindex番目を入れ替える
			let p = [...state.parts];
			const buf = p.slice(i-1,i+1);
			p.splice(i-1,2,buf[1],buf[0]);
			
			return {
				...state,
				parts:p
			}
		}

		case 'dropPart':{
			const i = action.index;
			if(i === state.parts.length-1){return state;}

			// index番目とindex+1番目を入れ替える
			let p = [...state.parts];
			const buf = p.slice(i,i+2);
			p.splice(i,2,buf[1],buf[0]);

			return {
				...state,
				parts:p
			}
		}

		default : 
			throw new Error(`invalid action ${action.type}`);
	}
}

export default function ScriptEditor(props){
	const classes = useStyles();
	const bot = useContext(BotContext);
	const auth = useContext(AuthContext);
	const [state,dispatch] = useReducer(reducer,initialState(bot.state));
	const [saved,setSaved] = useState(false);

	function handleSave(e){
		bot.handleSave(state);
		setSaved(true);
	}

	function handleSaveAndUpload(e){
		bot.handleSave(state,true);
		setSaved(true);
	}

	function toParentPage(){
		bot.clearMessage();
		props.toParentPage();
	}


	function handleAddPart(e){ dispatch({type:'appendNewPart'}); }

	function handleRaisePart(index){ 
		dispatch({type:'raisePart',index:index});
	}

	function handleDropPart(index){
		dispatch({type:'dropPart',index:index});
	}


	const fieldUnsatisfied = state.displayName === "" || state.id === "";

	return (
		<Grid container
		 className={classes.root}
		 spacing={1}
		 alignContent="flex-start">
			<Grid item xs={6}>
				<Typography 
					variant="body2">
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
				<Typography variant="body2">
					チャットボットの公開状態
				</Typography>
				<ButtonGroup aria-label="publish"
					className={classes.wideButton}>
					<Button
						variant={state.published ? "outlined" : "contained"}
						color={state.published ? "default" : "primary"}
						onClick={e=>dispatch({type:"setPublished",published:false})}
					>
						プライベート
					</Button>
					<Button
						variant={state.published ? "contained" : "outlined"}
						color={state.published ? "primary" : "default"}
						onClick={e=>dispatch({type:"setPublished",published:true})}
					>
						シェア
					</Button>
				</ButtonGroup>
			</Grid>
			<Grid item xs={12}>
			<Typography 
					variant="body2">
				チャットボットの型式
				</Typography>
				<Paper className={classes.textField}>
					<InputBase 
						id="id"
						placeholder="例：HelloBot-1.0.2"
						fullWidth
						value={state.id}
						onChange={e=>dispatch({
							type:'changeId',
							user:auth.user,
							id:e.target.value})}
					/>
				</Paper>
			</Grid>
			<Grid item xs={6}>
				<Typography variant="body2">
					作者名
				</Typography>
				<Paper className={classes.readOnlyField}>
					{state.creatorName}
				</Paper>				
			</Grid>
			<Grid item xs={6}>
				<Typography variant="body2">
					前回保存時刻
				</Typography>
				<Paper className={classes.readOnlyField}>
					{toTimestampString(state.timestamp)}
				</Paper>										
			</Grid>
			<Grid item xs={12}>
				<Typography variant="body2">
					概要
				</Typography>
				<Paper className={classes.textField}>
					<InputBase 
						id="description"
						placeholder="例：このボットは挨拶を返します"
						fullWidth
						multiline
						rowsMax={5}
						value={state.description}
						onChange={e=>dispatch({
							type:'changeDescription',
							user:auth.user,
							description:e.target.value})}
					/>
				</Paper>
			</Grid>
			<Grid item xs={12}>
				<Typography variant="body2">
					パート
				</Typography>
				<PartsList
					parts={state.parts}
					partContext={state.partContext}
					handleAddPart={handleAddPart}
					handleRaisePart={handleRaisePart}
					handleDropPart={handleDropPart}
				/>
				
			</Grid>

			<Grid item xs={12}>
				{bot.message}
				{state.displayName === "" && 
					<Typography color="error">チャットボットの名前を入力してください</Typography>
				}
				{state.id === "" &&
					<Typography color="error">チャットボットの型式を入力してください</Typography>
				}
			</Grid>
			<Grid item xs={12}>
				<Button className={classes.wideButton}
					variant="contained" color="primary"
					size="large"
					disabled = {fieldUnsatisfied}
					onClick={handleSaveAndUpload}
				>
					<UploadIcon/>アップロード＆このデバイスに保存
				</Button>
			</Grid>
			<Grid item xs={12}>
				<Button className={classes.wideButton}
					variant="outlined"
					size="large"
					disabled = {fieldUnsatisfied}
					onClick={handleSave}
				>
					<SaveIcon/>このデバイスに保存
				</Button>
			</Grid>
			<Grid item xs={12}>
				<Button className={classes.wideButton}
					size="large"
					onClick={toParentPage}
				>
					{ saved ? "OK" : "キャンセル" }
				</Button>
			</Grid>		
		</Grid>
	)
}