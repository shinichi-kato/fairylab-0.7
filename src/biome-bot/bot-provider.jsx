import React ,{useState,useEffect,createContext,useContext,useReducer} from 'react';
import BiomeBot from './BiomeBot.jsx';
import DownloadDialog from './download-dialog.jsx'; 
import SorterSelector from './sorter-selector.jsx';

import {AuthContext} from '../authentication/auth-provider.jsx';

const biomeBot = new BiomeBot();
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
		memory: JSON.stringify({}),
	});

	fsBotRef.collection('part').doc('greeting').set({
		type: "sensor",
		availability: 1,
		triggerLevel: 0.1,
		retention: 1,
		dict:JSON.stringify([
			[["こんにちは","今日は","今晩は","こんばんは"],["こんにちは！","今日もお疲れ様です"]],
			[["ばいばい","さようなら"],["ばいば〜い"]],
			[["怒りっぽいと言われた"],["そうだったんですか。。。\n情熱的なんですね。"]]
		]),
	});

	
}

function initialState(){
	// localStorageからbotをロード
	const data = {
		id : localStorage.getItem('bot.id') || null,
		displayName : localStorage.getItem('bot.displayName') || 'noname',
		photoURL : localStorage.getItem('bot.photoURL') || '',
		creatorUID : localStorage.getItem('bot.creatorUID') || null,
		creatorName : localStorage.getItem('bot.creatorName') || '',
		timestamp : localStorage.getItem('bot.timestamp') || '',
		published : localStorage.getItem('bot.published') || false,
		description: localStorage.getItem('bot.description') || "",
		parts : JSON.parse(localStorage.getItem('bot.parts')) || [],
		memory : JSON.parse(localStorage.getItem('bot.memory')) || {},
	};

	biomeBot.setParam(data);

	let partContext = {};
	
	for (let part of data.parts) {
		let context = {};
		context.type = localStorage.getItem(`bot.part.${part}.type`);
		context.availability = localStorage.getItem(`bot.part.${part}.availability`);
		context.triggerLevel = localStorage.getItem(`bot.part.${part}.triggerLevel`);
		context.retention = localStorage.getItem(`bot.part.${part}.retention`);
		context.dict = JSON.parse(localStorage.getItem(`bot.part.${part}.dict`));
		partContext[part] = {...context};
		biomeBot.setPart(context);
	}

	return ({
		...data,
		botState: '',
		partContext : partContext,
	})
};

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
			localStorage.setItem('bot.timestamp',dict.timestamp);
			localStorage.setItem('bot.parts',JSON.stringify(dict.parts));
			localStorage.setItem('bot.memory',JSON.stringify(dict.memory));

			biomeBot.setParam(dict);

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
			localStorage.setItem(`bot.part.${name}.triggerLevel`,dict.triggerLevel);
			localStorage.setItem(`bot.part.${name}.retention`,dict.retention);
			localStorage.setItem(`bot.part.${name}.dict`,JSON.stringify(dict.dict));

			biomeBot.setPart(dict);

			return {
				...state,
				partContext:{
					...state.partContext,
					[name]:dict,
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
		fetchBotList();
	}

	function handleSetSampleBot(){
		setSampleBot(props.firebase,firestoreRef);
		fetchBotList();
	}
	
	function fetchBotList(){
		const settings = sorterSettings[sorters[sorterIndex]];
		console.log("index=",sorterIndex,"settings=",settings)
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
						memory: {},
					})
				})
				setBotList(result);

			}).catch(error=>{
				setMessage(error)
				setShowDownload(true);
			});

	}


	function handleDownload(settings){
		dispatch({type:'setParam',dict:settings})
		biomeBot.setParam(settings);
		const botRef=firestoreRef.collection('bot').doc(settings.id);
		loadParts(botRef,settings.parts);
		setShowDownload(false);
	}

	function loadParts(botRef,parts){

		// 各パートのパラメータを取得し記憶。
		for(let part of parts){
			let fsRef = botRef
				.collection('part').doc(part);

			fsRef.get().then(doc=>{
				if(doc.exists){
					let data = doc.data();
					data.name = part;
					dispatch({type:'setPart',dict:data});
					biomeBot.setPart(part,data);
					
				}else{
					setMessage(`パート${part} がサーバーにありませんでした`)
				}
			})
			.catch(error=>{
				setMessage(error);
				setShowDownload(true);
			})
		}
	}

	function handleSave(settings,upload){

		const newSettings = {

			dispalyName:settings.displayName,
			photoURL:settings.photoURL,
			creatorUID:settings.creatorUID,
			creatorName:settings.creatorName,
			timestamp:firebase.firestore.FieldValue.serverTimestamp(),
			description:settings.description,
			published:settings.published,
			parts:JSON.stringify(settings.parts),
			likeCount:settings.likeCount,
			memory:JSON.stringify({}),

		};
		
		dispatch({type:'setParam',dict:newSettings});
		setMessage(`このデバイスに ${newSettings.id} を保存しました`)

		if(upload){
			let fsBotRef = firestoreRef.collection('bot').doc(settings.id);
			fsBotRef.get().then(doc=>{
				if(doc.exists){
					let data =doc.data();
					if(data.creatorUID === newSettings.creatorUID){
						// すでに同じ型式のデータが存在する場合、creatorUIDが自分と同じであれば
						// 上書きを実行する。そうでなければ上書き禁止メッセージを送る
						setMessage(`${newSettings.id} をアップロードしました`)
					}else{
						setMessage(`他のユーザの${data.id}が存在しています。型式名を変えてください`)
					}
				}
			})
			fsBotRef.set(newSettings);
	
		}
	}


	useEffect(()=>{
		let loaded = false;
		if(loaded){ return; }

		if(firestoreRef !== null) 
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
								parts:JSON.parse(data.parts)
							};

							dispatch({type:'setParam', dict:data});
							biomeBot.setParam(data);
							loadParts(fsRef,data.parts);
						}

					}else{
						// ローカルにあるボットがまだアップロードされていない
						// -> 何もしない
					}

				})
				.catch(error=>{
					setMessage(error);
					setShowDownload(true);
				});

				return;
			}
			
			// 2. localstorageにデータがない場合、
			//    firebaseからダウンロードするDialogを開く
			fetchBotList();
			setShowDownload(true);
			
		}

	},[firestoreRef]);

  return (
		<BotContext.Provider value={{
			message:message,
			state:state,
		}}>
			{showDownload ?
				<DownloadDialog 
					sorterSelector={
						<SorterSelector
							sorters={sorters}
							sorterIndex={sorterIndex}
							handleChangeSorterIndex={handleChangeSorterIndex}
							sorterSettings={sorterSettings} />
					}
					message={message}
					botList={botList}
					fetchBotList={fetchBotList}
					handleDownload={handleDownload}
					handleSave={handleSaveAndUpload}
					handleSetSampleBot={handleSetSampleBot}
					handleClearMessage={setMessage("")}
				/>
				:
				props.children
			}

		</BotContext.Provider>
	)
}