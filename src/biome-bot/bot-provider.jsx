import React ,{useState,useEffect,createContext,useContext,useReducer} from 'react';
import BiomeBot from './BiomeBot.jsx';
import DownloadDialog from './download-dialog.jsx'; 
import SorterSelector from './sorter-selector.jsx';

import {AuthContext} from '../authentication/auth-provider.jsx';

import {getStrByteSize} from './getStrByteSize.jsx';

const initialMemory = {
	inDictWordsForBot:[
		'{botName}さん','{botName}君','{botName}氏',
		'{botName}','あなた','おまえ','君'],
	inDictWordsForUser:[
		'{userName}','私','僕','俺'],
	outDictBotInWords:[
		'{botName}','私'
	],
	outDictUserInWords:[
		'{userName}さん','あなた',
	],
};

// hubでのボット発話を制御するパラメータ
const hubParam={
	availability: 0.6,
	generosity: 0.3,
	retention: 0.6,
};


const biomeBot = new BiomeBot(hubParam);
const BOT_LIST_MAX_LEN=20;

const sorters = [
	'timestamp','name','likeCount','mybot'
];

const sorterSettings={
	'mybot':{
		label:'マイボット',
		order:'timestamp',
		dir:'desc',
		private:true,
	},
	'timestamp':{
		label:'新着順',
		order:'timestamp',
		dir:'desc',
		private:false,
	},
  'name':{
		label:'名前順',
		order:'displayName',
		dir:"asc",
		private:false,
	},
	'likeCount':{
		label:'人気順',
		order:'likeCount',
		dir:'desc',
		private:false,
	}
};



export const BotContext = createContext();




function setSampleBot(firebase,firestoreRef){
	// 
	// firestoreに何もボットが保存されていない場合にサンプルのボットを書き込む
	let fsBotRef = firestoreRef.collection('bot').doc('HelloBot');
	
	fsBotRef.set({
		displayName:'あいさつボット',
		photoURL: 'avatar/bot/crystal/blueCrystal.svg',
		creatorUID: null,
		creatorName:"system",
		timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		description: '挨拶を返すボットです',
		published : true,
		parts: JSON.stringify(["greeting"]),
		likeCount:0,
		memory: JSON.stringify(initialMemory),
	});

	fsBotRef.collection('part').doc('greeting').set({
		type: "sensor",
		availability: 1,
		generosity: 0.1,
		retention: 1,
		dictSource:`[
			[["こんにちは","今日は","今晩は","こんばんは"],["こんにちは！{userName}さん！","今日もお疲れ様です"]],
			[["ばいばい","さようなら"],["ばいば〜い"]],
			[["怒りっぽいと言われた"],["そうだったんですか。。。情熱的なんですね。"]]
		]`,
	
	});

	
}

function initialState(){
	// localStorageからbotをロード
	let memory = JSON.parse(localStorage.getItem('bot.memory')) || new Object();
	if(!'inDictWordsForBot' in memory){
		memory = initialMemory;
	}

	const data = {
		id : localStorage.getItem('bot.id') || null,
		displayName : localStorage.getItem('bot.displayName') || 'noname',
		photoURL : localStorage.getItem('bot.photoURL') || '',
		creatorUID : localStorage.getItem('bot.creatorUID') || null,
		creatorName : localStorage.getItem('bot.creatorName') || '',
		timestamp : localStorage.getItem('bot.timestamp') || '',
		published : localStorage.getItem('bot.published') || false,
		description: localStorage.getItem('bot.description') || "",
		parts : JSON.parse(localStorage.getItem('bot.parts')) || "",
		memory : {...memory},
	};


	biomeBot.setParam({settings:data,forceReset:true});

	let partContext = new Object();
	for (let part of data.parts) {

		let context = {
			type : localStorage.getItem(`bot.part.${part}.type`) || "",
			availability : Number(localStorage.getItem(`bot.part.${part}.availability`)) || 0,
			generosity : Number(localStorage.getItem(`bot.part.${part}.generosity`)) || 0,
			retention : Number(localStorage.getItem(`bot.part.${part}.retention`)) || 0,
			dictSource : localStorage.getItem(`bot.part.${part}.dictSource`) || "[]",
			_dictSourceByteSize : 0,
		};

		context._dictSourceByteSize = getStrByteSize(context.dictSource);
		

		partContext[part] = {...context};
		context.name=part;
		// ここではbiomebot.setPartしない。
		// setPartが非同期処理なので、initialStateでは扱えない
	}

	return ({
		...data,
		botState: 'notCompiled',
		partContext : partContext,
		})
	
}

function reducer(state,action){

	switch(action.type){
		case 'ready':{
			return {
				...state,
				botState: 'ready'
			}
		}

		case 'setParam':{
			const dict = action.dict;
			localStorage.setItem('bot.id',dict.id);
			localStorage.setItem('bot.displayName',dict.displayName);
			localStorage.setItem('bot.photoURL',dict.photoURL);
			localStorage.setItem('bot.creatorUID',dict.creatorUID);
			localStorage.setItem('bot.creatorName',dict.creatorName);
			localStorage.setItem('bot.description',dict.description);
			localStorage.setItem('bot.published',dict.published);
			localStorage.setItem('bot.timestamp',dict.timestamp.toString());
			localStorage.setItem('bot.parts',JSON.stringify(dict.parts));	
			localStorage.setItem('bot.memory',JSON.stringify(dict.memory));

			biomeBot.setParam({settings:dict,forceReset:true});

			return {
				...dict,
				botState: 'ready',
			}
		}

		case 'setPart':{
			const dict = action.dict;
			const name = action.dict.name;
			localStorage.setItem(`bot.part.${name}.type`,dict.type);
			localStorage.setItem(`bot.part.${name}.availability`,dict.availability);
			localStorage.setItem(`bot.part.${name}.generosity`,dict.generosity);
			localStorage.setItem(`bot.part.${name}.retention`,dict.retention);
			localStorage.setItem(`bot.part.${name}.dictSource`,dict.dictSource);
			// _dictSourceByteSizeは毎回計算するので保存はしない。
			// biomeBot.setPart({settings:dict,forceReset:true})
			// .then(result=>{
			// 	if(result){
					
			// 	}
			// });

			return {
				...state,
				partContext:{
					...state.partContext,
					[name]:{
						...dict,
						_dictSourceByteSize:getStrByteSize(dict.dictSource),
					}
				},
				botState: 'ready'
			}
		}

		default:
			throw new Error(`invalid action ${action.type}`);
	}
}



export default function BotProvider(props){
	/*
		チャットボットクラスBiomeBotはパラメータ、パート、辞書を利用する。
		全データはfirestoreに保存され、BotProviderがI/Oを提供する。
		また同じデータはlocalStorageにも保存され次回起動時に状態を保存する。
		
	*/
	const {firebase,firestoreRef} = props;
	const [state,dispatch] = useReducer(reducer,initialState());
	const [message,setMessage] = useState("");
	const [botList,setBotList] = useState([]);
	const [sorterIndex,setSorterIndex]  = useState(0);
	const [showDownload,setShowDownload] = useState(false);
	const auth = useContext(AuthContext);



	function handleChangeSorterIndex(index){
		setSorterIndex(index);
		fetchBotList(index);
	}

	function handleSetSampleBot(){
		setSampleBot(props.firebase,firestoreRef);
		fetchBotList(sorterIndex);
	}
	
	function fetchBotList(sorterindex){
		const settings = sorterSettings[sorters[sorterindex]];
		const cond = settings.private ? 
			{l:'creatorUID',r:auth.user.uid} :
			{l:'published',r:true};
		
		firestoreRef.collection('bot')
			.where(cond.l,'==',cond.r)
			// .orderBy(settings.order,settings.dir) // index生成まわりらしきエラーが出る
			.limit(BOT_LIST_MAX_LEN)
			.get()
			.then(snapshot=>{
				let result=[];
				snapshot.forEach(item=>{
					const d=item.data();
					console.log("data=",d);
					result.push({
						id : item.id,
						displayName : item.id,	//仮の名前としてid名を使用
						photoURL : d.photoURL,
						creatorUID : d.creatorUID,
						creatorName : d.creatorName,
						published : d.published,
						description: d.description,
						timestamp : d.timestamp,
						parts : JSON.parse(d.parts),
						likeCount : d.likeCount,
						memory: JSON.parse(d.memory) ||  initialMemory,
						
					})
				})
				setBotList(result);

			}).catch(error=>{
				setMessage(error)
				setShowDownload('required');
			});

	}


	function handleDownload(settings){
		dispatch({type:'setParam',dict:settings})
		biomeBot.setParam({settings:settings,forceReset:true});
		loadParts(settings.id,settings.parts);
		setShowDownload(false);
	}

	function loadParts(botId,parts){
		/* 各パートのパラメータを取得し記憶する。
			firestoreからの読み込みには時間がかかるため、この関数でのsetPartが処理される前に
			UIの描画が先行する。UI側ではPartが更新される前のdefault状態でも動作するようにする。
			それがうまく行かないとき、.get().then()が動作も応答もしないかのように見えるので注意。
		*/
		let partContexts=new Object();
		firebase.firestore()
			.collection('bot').doc(botId)
			.collection('part')
			.get()
			.then(querySnapshot=>{
				querySnapshot.forEach(doc=>{
					let data={
						...doc.data(),
						name:doc.id,
					};
					dispatch({type:'setPart',dict:data});
					partContexts[doc.id] = {...data};
				});
				handleCompile(partContexts);
			})
			.catch(error=>{
				setMessage(error);
				setShowDownload('required');
			})
	}

	function handleCompile(partContexts){
		/* bot-providerに記憶したpartContextでbiomebotをコンパイル
		Partのコンパイルは並列で行い、すべて終了したら状態の更新を行う
		*/
		setMessage("compiling");
		console.log("compiling",partContexts)
		Promise.resolve()
			.then(()=>{
				// Partのコンパイルは並列で処理する
				return Promise.all(Object.keys(partContexts).map(part=>{
					return new Promise((resolve,reject)=>{
						console.log("compiling part",part)
						partContexts[part].name=part;
						resolve(biomeBot.setPart({settings:partContexts[part]}));

					});
				}));
			})
			.then(results=>{
				//すべての結果がresultsに入る。
				for(let result of results){
					if(result !== 'ok'){
						setMessage(result)
						return;
					}
				}
				setMessage("ok");

			});
	}

	function saveParts(botId,partContext){
		const partRef = firebase.firestore()
			.collection('bot').doc(botId).collection('part');


		for(let part in partContext){
			const context = partContext[part]; 
			partRef.doc(part).set({
				type:context.type,
				availability:context.availability,
				generosity:context.generosity,
				retention:context.retention,
				dictSource:context.dictSource,
			});
		}
		
	}
	
	function handleClearMessage(){
		setMessage("");
	}
	

	function handleSave(settings,upload){

		const newSettings = {
			id:settings.id,
			displayName:settings.displayName,
			photoURL:settings.photoURL,
			creatorUID:settings.creatorUID,
			creatorName:settings.creatorName,
			timestamp:firebase.firestore.Timestamp.now(),
			description:settings.description,
			published:Boolean(settings.published),
			parts:settings.parts,
			memory:settings.memory || initialMemory,

		};
		
		dispatch({type:'setParam',dict:newSettings});

		for (let part of settings.parts){

			dispatch({type:'setPart',dict:{
				...settings.partContext[part],
				name:part
			}});
		}


		setMessage(`このデバイスに ${newSettings.id} を保存しました`)

		if(upload){
			let fsBotRef = firestoreRef.collection('bot').doc(settings.id);
			fsBotRef.get().then(doc=>{
				if(!doc.exists){

					newSettings.parts = JSON.stringify(newSettings.parts);
					newSettings.timestamp = firebase.firestore.FieldValue.serverTimestamp();
					
					fsBotRef.set(newSettings);
					saveParts(settings.id,settings.partContext);
					setMessage(`${newSettings.id} をアップロードしました`);
				}
				else{
					let data =doc.data();
					if(data.creatorUID === newSettings.creatorUID){
						// すでに同じ型式のデータが存在する場合、creatorUIDが自分でなければ
						// 上書き禁止メッセージを送る
						newSettings.timestamp = firebase.firestore.FieldValue.serverTimestamp();
						newSettings.parts = JSON.stringify(newSettings.parts);
						newSettings.memory = JSON.stringify(newSettings.memory);

						fsBotRef.set(newSettings);
						saveParts(settings.id,settings.partContext);
						setMessage(`${newSettings.id} をアップロードしました`);
					}
					else{
						setMessage(`すでに${settings.id}があります。違う型式名にしてください`)
					}
				}
			})
	
		}
	}

	function handleShowDownloadDialog(){
		fetchBotList(sorterIndex);
		setShowDownload('notRequired')
	}

	function handleClose(){

		setShowDownload(false);
	}

	function handleReply(text){
		return biomeBot.reply(text)
	}

	function handleHubReply(text){
		return biomeBot.hubReply(text);
	}

	
	useEffect(()=>{
		let loaded = false;
		if(loaded){ return; }

		if(firestoreRef) 
		{
			loaded = true;

			if(!localStorage.getItem('botDB_initialized')){
				// 0. failylabを初回起動したときに限り、
				// 'bot'コレクションが空だったら sampleBotを書き込む
				localStorage.setItem('botDB_initialized',true);

				firestoreRef.collection('bot').limit(1)
					.get()
					.then(doc=>{
						if(!doc.exists){
							setSampleBot(props.firebase,firestoreRef);
						}
					})
			}
			
			console.log("state.id",state.partContext)
			if(state.id){
				// 1. 起動時、localStorageにデータがあれば
				//    firebase上のデータ更新を確認し、最新版をロードしてコンパイル
				
				let fsRef = firestoreRef
					.collection('bot').doc(state.id);
				fsRef.get().then(doc=>{
					if(doc.exists){
						let data = doc.data();
				
						if(data.timestamp.toMillis > state.timestamp.toMillis){
							// 型式が同じでローカルのほうが古い場合は
							// 最新版をロード
	
							data = {
								...data,
								id:doc.id,
								parts:data.parts,
							};

							dispatch({type:'setParam', dict:data});
							biomeBot.setParam({settings:data,forceReset:true});
							loadParts(state.id,data.parts);
							return;
						}
					}
					
					// ローカルにボットがあるが、まだアップロードされていない
					// またはローカルが最新
					// -> compile
					handleCompile(state.partContext);
					

				})
				.catch(error=>{
					setMessage(error);
					setShowDownload('required');
				});

				return;
			
			}else{
				// 2. localstorageにデータがない場合、
				//    firebaseからダウンロードするDialogを開く
				fetchBotList(sorterIndex);
				setShowDownload('required');
			}
		
		}

	},[firestoreRef]);

	
  return (
		<BotContext.Provider value={{
			message:message,
			state:state,
			handleSave:handleSave,
			downloadDialog:handleShowDownloadDialog,
			clearMessage:handleClearMessage,
			reply:handleReply,
			hubReply:handleHubReply,
		}}>
			{showDownload !== false ?
				<DownloadDialog 
					required={showDownload==='required'}
					sorterSelector={
						<SorterSelector
							sorters={sorters}
							sorterIndex={sorterIndex}
							handleChangeSorterIndex={handleChangeSorterIndex}
							sorterSettings={sorterSettings} />
					}
					message={message}
					botList={botList}
					handleDownload={handleDownload}
					handleSave={handleSave}
					handleSetSampleBot={handleSetSampleBot}
					handleClearMessage={handleClearMessage}
					handleClose={handleClose}
				/>
				:
				props.children
			}

		</BotContext.Provider>
	)
}