import InternalRepr from './internalRepr.jsx';
import TextRetriever from './textRetriever.jsx';
import {randomInt} from 'mathjs';

const internalRepr = new InternalRepr();


export default class Part {
	constructor(settings,wantCompile){
		this.name=settings.name || '';
		this.type = settings.type;
		this.availability = parseFloat(settings.availability);
		this.generosity = parseFloat(settings.generosity);
		this.retention = parseFloat(settings.retention);
		this.inDict = [];
		this.outDict = [];
		this.replier = ()=>{return "part.seutp()が実行されていません"};
	}

	compile(source,wantCompile){
		// wantCompile:
		// コンパイルを指示されておらず、キャッシュがあればそれを使用
		//  現状ではinDictをシリアライズで来ていないので常にtrue
		wantCompile = true;
		if(!wantCompile){
			this.inDict = JSON.parse(localStorage.getItem(`BiomeBot.{this.name}.inDict`)) || null;
			this.outDict = JSON.parse(localStorage.getItem(`BiomeBot.{this.name}.outDict`)) || null;

			if (this.inDict && this.outDict){
				return;
			}
		}

		const result = checkDictStructure(this.name,source);
		this.errorMessage=result.error;

		switch(this.type){
			case 'sensor':{
				/* dictは
					[ [["入力1","入力2"...] , ["出力1","出力2"...]] , ...]
					となっている。TextRetrieverには内部表現化したリスト
					[ [入力1を内部表現化したリスト,入力2を内部表現化したリスト...], ...]
					を渡す。
					
				*/	
				

				this.inDict = new TextRetriever(result.dict.map(l=>internalRepr.from_inDict(l[0])));
				this.outDict = result.dict.map(l=>l[1]);
				break;
			}
			default: {
				this.inDict = [];
				this.outDict = [];
				this.errorMessage = `type ${this.type} は使用できません`
			}
		}
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


function isArray(obj){
	return Object.prototype.toString.call(obj) === '[object Array]';
}

export function checkDictStructure(name,source){
		/*
			辞書は
			[
				[
					["in1","in2","in3"...],["out1","out2","out3"...]
				]
			]
			という形式になっている。このデータ構造に一致しない部分はdictから削除するとともにエラーメッセージを返す
		*/
		let dict = null;
		let errorMessage=null;
		try{
			dict = JSON.parse(source);
		} 
		catch(e){
			if(e instanceof SyntaxError){
				errorMessage = 
					`辞書${name}の line:${e.lineNumber} column:${e.columnNumber} に文法エラーがあります`;
				console.log(errorMessage)
				return {dict: [[[],[]]],error:errorMessage}
			}
		}

		let newDict = [];

		if (isArray(dict)){
			// 辞書全体
			for (let i in dict){
				let line = dict[i];

				if (isArray(line) && line.length === 2){
					// 一つの入力-出力ペア
					let ins = line[0];
					let outs = line[1];

					if(isArray(ins)){
						// 文字列のリスト
						for(let j in ins){
							if(typeof ins[j] !== 'string'){
								errorMessage=`Error:${i}行の1番目(入力文字列)のリストに文字列以外が格納されています`;
								if (newDict.length === 0){
									return {dict:[[[],[]]],error:errorMessage}
								}
								return {dict:newDict,error:errorMessage};
							}
						}
					}
					if(isArray(outs)){
						// 文字列のリスト
						for(let j in outs){
							if(typeof outs[j] !== 'string'){
								errorMessage=`Error:${i}行の2番目(出力文字列)のリストに文字列以外が格納されています`;
								if(newDict.length===0){
									return {dict:[[[],[]]],error:errorMessage};
								}
								return {dict:newDict,error:errorMessage};
							}
						}
					}
					// 一つの行が正常だった
					newDict.push(line);
				}
				else if(typeof line === 'string'){
					// 文字列のみはコメントとして無視する
				}
				else {
					errorMessage=`Error:${i}行が [[入力文字列リスト],[出力文字列リスト]] という形式になっていません`;
					if(newDict.length===0){
						return {dict:[[[],[]]],error:errorMessage};
					}
					return {dict:newDict,error:errorMessage};
				}
			}
			return {dict:newDict,error:null};
		}
		else{
			errorMessage=`Error:辞書が[ [[入力文字列リスト],[出力文字列リスト]], ... ]という形式になっていません`;
			return {dict:[[[],[]]],error:errorMessage};
		}
	}

