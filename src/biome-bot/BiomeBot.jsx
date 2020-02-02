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


    
  */
  constructor(){
    this.partContext=new Object();
    this.memory = JSON.parse(localStorage.getItem('BiomeBot.memory')) || {queue:[]};
    this.currentParts = JSON.parse(localStorage.getItem('BiomeBot.currentParts')) || [];
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
    
    let text = "BiomeBot Not Respond";
    return new Promise((resolve,reject)=>{
      if(this.memory.queue.length !== 0){
        text = this.memory.queue.shift();
      }
      else{
        for(let i in this.currentParts){
          let partName=this.currentParts[i];
          let part = this.partContext[partName];
          // availability check
          if(Math.random() > part.availability){
            console.log("availability insufficient")
            continue;
          }

          // generousity check
          const reply = part.replier(message,this.memory);
          if(reply.score < 1-part.generousity){
            console.log(`generousity:score ${reply.score} insufficient`);
            continue
          }

          // 改行\nあったらqueueに送る
          if(reply.text.indexOf('\n') !== -1){
            const replies = reply.text.split('\n');
						text = replies.shift();
						this.memory.queue.push(replies);
          }

          // retention check
          if(Math.random() < part.retention){
            // このパートを末尾に
            this.currentParts.slice(i,1);
            this.currentParts.push(partName);
            // currentPartsの順番を破壊するのでforループを抜ける
            break;
          }
        }
      }
      
      resolve({
        botId:this.id,
        text:text,
        displayName:this.displayName,
        photoURL:this.photoURL,
      });

      this.dump();

      
    })
  }

}