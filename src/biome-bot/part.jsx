import InternalRepr from './internalRepr.jsx';
import TextRetriever from './textRetriever.jsx';
import {randomInt} from 'mathjs';

const internalRepr = new InternalRepr();


export default class Part {
	constructor(settings,wantCompile){
		this.name=settings.name || '';
		this.type = settings.type;
		this.availability = settings.availability;
		this.generosity = settings.generosity;
		this.retention = settings.retention;
		this.inDict = [];
		this.outDict = [];
		this.repier = {};

		this.compile(settings.dictSource,wantCompile);
		this.setup();
	}

	compile(dictSource,wantCompile){
		if(!wantCompile){
			// コンパイルを指示されておらず、キャッシュがあればそれを使用
			//  現状ではinDictをシリアライズで来ていないので保留
			this.inDict = JSON.parse(localStorage.getItem(`BiomeBot.{this.name}.inDict`)) || null;
			this.outDict = JSON.parse(localStorage.getItem(`BiomeBot.{this.name}.outDict`)) || null;

			if (this.inDict && this.outDict){
				return;
			}
		}
		let dict =null;
		
		try{
			dict = JSON.parse(dictSource);
		} 
		catch(e){
			if(e instanceof SyntaxError){
				this.errorMessage = 
					`辞書${this.name}の line:${e.lineNumber} column:${e.columnNumber} に文法エラーがあります`;
				return ;
			}
		}

		// コメント行(文字列だけの行)削除
		let d = dict.filter(x=>typeof x !== "string");

		switch(this.type){
			case 'sensor':{
				/* dictは
					[ [["入力1","入力2"...] , ["出力1","出力2"...]] , ...]
					となっている。TextRetrieverには内部表現化したリスト
					[ [入力1を内部表現化したリスト,入力2を内部表現化したリスト...], ...]
					を渡す.
				*/	
				this.inDict = new TextRetriever(d.map(l=>internalRepr.from_inDict(l[0])));
				this.outDict = d.map(l=>l[1]);
				break;
			}
			default: {
				this.inDict = [];
				this.outDict = [];
				this.errorMessage = `type ${this.type} は使用できません`
			}
		}
		console.log("compiled")
	}

	setup(){
		switch(this.type){
			case 'sensor':{
				this.replier=(message,state)=>{
					const ir = internalRepr.from_message(message);
					const result = this.inDict.retrieve(ir);
					let cands= [];
					let text = "not found";
					if(result.score !== 0){
						cands = this.outDict[result.index];
						text = cands[randomInt(cands.length)];
					}

					return ({
						name:this.name,
						speakerId:this.id,
						avatar:this.avatarId,
						text:text,
						score:result.score
					});
				};
				break;
			}
			default:{
				this.replier=(message,state)=>({
					name:this.name,
					speakerId:this.id,
					avatar:this.avatarId,
					text:`type ${this.type} は使用できません`,
					score:1
				});
			}
		}
	}
}