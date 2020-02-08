// BiomeBotのコア
import Part from './part.jsx';

export default class BiomeBot{
  /*
    BiomeBot クラス

    BiomeBotはパラメータ,パートの2階層からなるデータで定義される。

    パラメータには以下の内容が含まれる。
    id : 同一サーバー内でユニークな型式名
    displayName : ユーザが変更できるボットの名前
    photoURL : 画面に表示するAvatarのURL(firebase.auth)
    creatorUID : 作成者のuid(firebase.auth)
    timestamp : アップデートしたときのタイムスタンプ
    parts : 初期状態でのパートの実行順を格納したリスト
    memory : ボットの記憶
    
    パートには以下の内容が含まれる
    type : パートの型
    availability : 稼働率（パートが動作する確率,0≦a≦1)
    generosity : 寛容性（辞書のスコアが1-sを上回ったら採用）
    retention : 維持率（1-retentionの確率でこのパートがpartsの最後尾に移動)
    dictSource : 辞書


    ## パートの集合体による返答の生成

    Biomebotは返答を生成するため複数のpartによる競争的な動作を行う。
    partには処理される順番があり、初期状態はbot.partsに格納されている。
    その順番は内部的にbiomebot.partsに格納され、動作中の入れ替わりを保持する。


    ## 辞書
    dictSourceはJSON形式を基本とする。ただし先頭文字が#である行はコメント行として扱う。
    辞書のJSON部分は
    [
      [
        ["input11","input12","input13"...],
        ["output11","output12","output13"...]
      ],
      [
        ["input21","input22","input23"...],
        ["output21","output22","output23"...]
      ],
      .
      .
      .
    ]
    という構造とし、input11〜1nに近い入力文字列に対してoutput11~1nの中から
    ランダムに選んだ一つを返す。


    ■■　多人数チャットにおけるチャットボットの動作について　■■

		多人数が同時に参加するHubでは一対一の会話と同じ量でチャットボットが発言すると
		チャットボットの発現量が多くなりすぎる。ここで各チャットボットはパートの集合体で
		パート間の相互作用によりどのパートが発言するかを決めていた。この考え方を複数の
		ボットに拡張し、Hub用にパートの変数と似た以下のパラメータを設定する。
		
		・Hub用availablity
    ボットの発言はこの確率で実行される。通常より低めにすることで
    ボリュームを抑える
		
		・Hub用generosity
		通常のパートよりも低めの値を設定し、かなりスコアの高い返答のみを実行する。
		これにより「おはよう！」には全員が返事するが、普通の話題は特定のボットしか
		応答しないようになる。

		・Hub用retention
		一度応答したボットはアクティブ状態になる。
		毎回retentionチェックを行い、成功したらHub用availabilityは1になる。
		失敗したらHub用Availablityはもとの値になる。

		これらは現バージョンでは固定の隠しパラメータだが、		いずれ親密度や体調で
		変動するようにしたい。
    
  */
  constructor(hubParam){
    this.partContext=new Object();
    this.memory = JSON.parse(localStorage.getItem('BiomeBot.memory')) || {queue:[]};
    this.currentParts = JSON.parse(localStorage.getItem('BiomeBot.currentParts')) || [];
    this.hub={
      availability : hubParam.availability,
      generosity : hubParam.generosity,
      retention : hubParam.retention,
      isActive : false
    };
  }

  setParam({settings,forceReset=false}){
    this.id = settings.id;
    this.displayName = settings.displayName;
    this.photoURL = settings.photoURL;
    this.creatorUID = settings.creatorUID;
    this.creatorName = settings.creatorName;
    this.timestamp = settings.timestamp;
    this.parts = settings.parts;

    if(forceReset){
      this.memory = {
        queue:this.memory.queue,
        ...settings.memory 
      };
      this.currentParts = settings.parts;

    }else{
      this.memory = JSON.parse(localStorage.getItem(`Biomebot.memory`)) ||
        {...settings.memory };
      
        if(!("queue" in settings.memory)){
          this.memory.queue=[];
        }
      
        if(this.currentParts.length===0){
          this.currentParts = [...this.parts];
        }
    }
    
  }

  setPart({settings,forceReset=false}){
     let part = new Part(settings,forceReset);
     part.compile(settings.dictSource)
     part.setup()
     this.partContext[settings.name] = part;
  }

  dump(){
    localStorage.setItem(`BiomeBot.memory`,JSON.stringify(this.memory));
    localStorage.setItem(`BiomeBot.currentParts`,JSON.stringify(this.currentParts));
  }


  reply(message){
    /* 一対一チャットにおける返答生成 */

    return new Promise((resolve,reject)=>{
      let result=this._partCircuit(message);

      this.dump();
      
      resolve({
        botId:this.id,
        text:result.text || "Bot Not Respond",
        displayName:this.displayName,
        photoURL:this.photoURL,
      });
      
    });
  }

  hubReply(message){
    /* 多人数チャットにおける返答生成 */
    let result = {text:null};
    return new Promise((resolve,reject)=>{
      if(this.memory.queue.length !== 0){
        result.text = this.memory.queue.shift();
      }     
      else{
        while(1){
          //hub availablity check
          if(!this.hub.isActive && Math.random() > this.hub.availability){
            break;
          }
          // hub generosity
          result = this._partCircuit(message);
          if(result.score < 1-this.hub.generosity){
            break;
          }
          

          // hub retention
          if(Math.random() > this.hub.retention){
            this.hub.isActive = false;
            // availabilityを戻す
          }else{
            // availablityを上げる
            this.hub.isActive = true;

          }
          break;
        }

      }
      this.dump();
      
      resolve({
        botId:this.id,
        text:result.text,
        displayName:this.displayName,
        photoURL:this.photoURL,
      });
    });
  }

  _partCircuit(message){
    
    let result = {text:null};
    if(this.memory.queue.length !== 0){
      result.text = this.memory.queue.shift();
    }
    else{
      for(let i in this.currentParts){
        let partName=this.currentParts[i];
        let part = this.partContext[partName];
        // availability check
        if(Math.random() > part.availability){
          // console.log("availability insufficient")
          continue;
        }

        // generousity check
        let reply = part.replier(message,this.memory);
        console.log("reply=",reply,"g=",part.generosity)
        if(reply.score < 1-part.generosity){
          // console.log(`generousity:score ${reply.score} insufficient`);
          continue
        }
        
        result = {...reply}

        // 改行\nあったらqueueに送る
        if(reply.text.indexOf('\n') !== -1){
          const replies = reply.text.split('\n');
          reply.text = replies.shift();
          this.memory.queue.push(replies);
        }

        // retention check
        if(Math.random() > part.retention){
          // このパートを末尾に
          this.currentParts.slice(i,1);
          this.currentParts.push(partName);
          // currentPartsの順番を破壊するのでforループを抜ける
          break;
        }

        // retentionチェックがOKだったらこのパートを先頭に
        this.currentParts.slice(i,1);
        this.currentParts.unshift(partName);
        // currentPartの順場案を破壊するのでループを抜ける
        break;

      }
    }

    this.dump();      
    
    return(result);
      
    
  }
}