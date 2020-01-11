// BiomeBotのコア
import Part from './part.jsx';

export default class BiomeBot{
  /*
    BiomeBot クラス

    BiomeBotはパラメータ,パートの2階層からなるデータで定義される。

    パラメータには以下の内容が含まれる。
    id : 同一サーバー内でユニークな型式名
    displayName : ユーザが変更できるボットの名前
    photoURL : 画面に表示するAvatarのURL
    creatorUID : 作成者のuid(firebase.auth利用)
    timestamp : アップデートしたときのタイムスタンプ
    parts : パートの名前のリスト
    memory : ボットの記憶
    
    パートには以下の内容が含まれる
    type : パートの型
    availability : 稼働率（パートが動作する確率,0-1)
    triggerLevel : トリガーレベル（辞書のスコアがこの点を超えたら採用）
    retention : 維持率（1-retentionの確率でこのパートがpartsの最後尾に移動)
    dict : 辞書

    
    BiomeBotはjson形式のdictを受け取ったらコンパイルを行い、
    コンパイル結果のinDict,outDictを内部的にlocalStorageに保持する

  */
  constructor(){
    this.partContext={};
    this.dict={};
    this.memory = {};
  }

  setParam(dict){
    this.id = dict.id;
    this.displayName = dict.displayName;
    this.photoURL = dict.photoURL;
    this.creatorUID = dict.creator;
    this.timestamp = dict.timestamp;
    this.parts = typeof dict.parts === 'string' ? JSON.parse(dict.parts) : dict.parts;
    this.memory = typeof dict.memory === 'string' ? JSON.parse(dict.memory) : dict.memory;
    
  }

  setPart(dict){
    this.partContext[dict.name] = new Part(dict);
  }

  setDict(name,dict){
    this.partContext[name].setDict(dict);
  }

  compileFromDict(dict){
    this.photoURL = dict.photoURL;
    console.log("compileFromDict not implemented")
    
    return {
      inDict:[],
      outDict:[],
    }
  }
}