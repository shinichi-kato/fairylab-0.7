import React ,{useState,useEffect,createContext,useReducer} from 'react';
import BiomeBot from './BiomeBot.jsx';
import DownloadDialog from './download-dialog.jsx'; 

const biomeBot = new BiomeBot();
const BOT_LIST_MAX_LEN=20;

export const BotContext = createContext();

function uploadSample(firestoreRef){
	// firestoreに何もボットが保存されていない場合にサンプルのボットを書き込む
	let fsRef = firestoreRef;
	
	fsRef.collection('bot').doc('greeting').set({
		displayName:'あいさつボット',
		photoURL: 'avatar/bot/crystal/blueCrystal.svg',
		creatorUID: null,
		timestamp: 0,
		parts: JSON.stringify(["greeeting"]),
		memory: JSON.stringify({})
	});

	fsRef.collection('part').doc('greeting').set({
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
	const data = {
		id : localStorage.getItem('bot.id') || null,
		displayName : localStorage.getItem('bot.displayName') || 'noname',
		photoURL : localStorage.getItem('bot.photoURL') || '',
		creatorUID : localStorage.getItem('bot.creatorUID') || null,
		timestamp : localStorage.getItem('bot.timestamp') || '',
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
		チャットボットクラスBiomeBotが利用するパラメータのI/O
	*/
	const firestoreRef = props.firestore;
	const [state,dispatch] = useReducer(reducer,initialState());
	const [message,setMessage] = useState("");
	const [botList,setBotList] = useState([]);
	const [showDownload,setShowDownload] = useState(false);

	
	function fetchBotList(sortby){
		firestoreRef.collection('bot')
			.order(sortby)
			.limit(BOT_LIST_MAX_LEN)
			.get()
			.then(snapshot=>{
				let result=[];
				snapshot.forEach(item=>{
					const d=item.data();
					result.push({
						id : item.id,
						displayName : d.displayName,
						photoURL : d.photoURL,
						creatorUID : d.creatorUID,
						timestamp : d.timestamp,
						parts : d.parts,
						memory: {},
					})
				})
				setBotList(result);

			}).catch(error=>{
				setMessage(error)
				setShowDownload(true);
			});

	}

	function loadParts(){

		// 各パートのパラメータを取得し記憶。
		
		for(let part of state.parts){
			let fsRef = firestoreRef
				.collection('part').doc(part);

			fsRef.get().then(doc=>{
				if(doc.exists){
					let data = doc.data();
					dispatch({type:'setPart',dict:data});
					biomeBot.setPart(data);
					
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

	useEffect(()=>{
		if(firestoreRef !== null) 
		{
			if(state.id){
				// 1. 起動時、localStorageにデータがあれば
				//    firebase上のデータ更新を確認し、最新版をロードしてコンパイル
				let fsRef = firestoreRef
					.collection('bot').doc(state.id);

				fsRef.get().then(doc=>{
					if(doc.exists){
						let data = doc.data();
						// 最新版かどうかチェックしていない
						dispatch({type:'setParam', dict:data});
						biomeBot.setParam(data);
						loadParts();

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
			//     firebaseにデータがあるか確認。なければサンプルをアップロード

			firestoreRef.collection('bot').limit(1)
			.get()
			.then(doc=>{
				if(!doc.exists){
					console.log("query is empty")
					uploadSample(firestoreRef);
				}
			});
			
				// 3. firebaseからダウンロードするDialogを開く
			setShowDownload(true);
		}

	},[firestoreRef]);

  return (
		<BotContext.Provider value={{
			message:message,
		}}>
			{showDownload ?
				<DownloadDialog 
					message={message}
					botList={botList}
					fetchBotList={fetchBotList}
				/>
				:
				props.children
			}

		</BotContext.Provider>
	)
}