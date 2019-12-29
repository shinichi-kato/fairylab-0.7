

## Installing

「Firebase を JavaScript プロジェクトに追加する」に従ってアプリの登録をします。
1. firebaseで新しくプロジェクトを作成

2.ウェブアプリの追加
→スクリプトの
```
  var firebaseConfig = {
    apiKey: "api-key",
    authDomain: "project-id.firebaseapp.com",
    databaseURL: "https://project-id.firebaseio.com",
    projectId: "project-id",
    storageBucket: "project-id.appspot.com",
    messagingSenderId: "sender-id",
    appID: "app-id",

  };

```

部分をコピーしてcredentials/firebase-init.jsにコピー

3. sudo npm install firebase-tools

4. firebase login
5. firebase init
single-page-app
index.htmlを初期化しない
rule.jsonを初期化しない

