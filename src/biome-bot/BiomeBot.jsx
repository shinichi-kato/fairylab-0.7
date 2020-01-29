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
    this.memory = {queue:[]};
    this.currentParts = [];
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
    }else{
      this.memory = JSON.parse(localStorage.getItem(`Biomebot.memory`)) ||
        {...settings.memory };
    }
    
  }

  setPart({settings,forceReset=false}){
     this.partContext[settings.name] = new Part(settings,forceReset);
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
          let part = this.currentParts[i];

          // availability check
          if(Math.random() > part.availability){
            continue;
          }

          // generousity check
          const reply = part.replier(message,this.memory);
          if(reply.score < 1-part.generousity){
            console.log(`generousity:score ${reply.score} insufficient`);
            continue
          }

          // retention check
          if(Math.random() < part.retention){
            // このパートを末尾に
            const me = part;
            this.currentParts.slice(i,1);
            this.currentParts.push(me);
          }

          
          // 改行\nあったらqueueに送る
          if(reply.text.indexOf('\n') !== -1){
            const replies = reply.text.split('\n');
						text = replies.shift();
						this.memory.queue.push(replies);
          }
            
          resolve({
            botId:this.id,
            text:text,
            displayName:this.displayName,
            photoURL:this.photoURL,
          });
        }
      }
    })
  }

}