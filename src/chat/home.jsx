import React,{useState,useCallback,useContext} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import {RightBalloon,LeftBalloon} from './balloons.jsx';
import Console from './console.jsx';

import {BotContext} from '../biome-bot/bot-provider.jsx';
import {AuthContext} from '../authentication/auth-provider.jsx';

const CHAT_WINDOW = 10;
const LOG_WINDOW = 100;

const useStyles = makeStyles(theme => ({
  container: {
   height:'calc( 100vh - 64px - 64px - 2px )',
   overflowY:'scroll',
   overscrollBehavior:'auto',
   WebkitOverflowScrolling:'touch',
   padding: 0
 }
}));


export default function Home(props){
    /*
    HOME
    ローカルでユーザとチャットボットが会話する画面。
    会話ログはlocalStorageに保存しておく。

    {
      displayName: ユーザの名前
      userId: auth user id
      photoURL: avatar
      text: 本文
      like: この発言につけたいいね
      timestamp: firebaseのタイムスタンプを使用
    }
    */
  const firebase = props.firebase;
  const classes = useStyles();
  const bot = useContext(BotContext);
  const auth = useContext(AuthContext);
  const user = auth.user;

  const [log,setLog] = useState(JSON.parse(localStorage.getItem('homelog') || "[]"));

  function writeLog(message){
    const newLog = [...log,message];
    newLog.slice(-CHAT_WINDOW);
    setLog(newLog);
    localStorage.setItem('homeLog',JSON.stringify(newLog));

  }

  function handleWriteMessage(text){
    writeLog({
      displayName:user.displayName,
      speakerId:user.uid,
      photoURL:user.photoURL,
      text:text,
      timestamp:firebase.firestore.Timestamp.now(),
    });
    
    bot.reply(text)
      .then(reply=>{
        if(reply.text !== null){
          writeLog({
            displayName:reply.displayName,
            photoURL:reply.photoURL,
            text:reply.text,
            speakerId:reply.botId,
            timestamp:firebase.firestore.Timestamp.now()
          });
        }
      })
  }

  
  // --------------------------------------------------------
  // currentLogが変更されたら最下行へ自動スクロール
  const myRef = useCallback(node => {
    if(node!== null){
      node.scrollIntoView({behavior:"smooth",block:"end"});
    }
  },[log])
  
  const logSlice=log.slice(-CHAT_WINDOW);
  const speeches = logSlice.map(speech =>{
    return (speech.speakerId === user.uid || speech.speakerId === -1 )?
      <RightBalloon speech={speech}/>
    :
      <LeftBalloon speech={speech} />
    }
  );

  return(
    <Box display="flex"
    flexDirection="column"
    flexWrap="nowrap"
    justifyContent="flex-start"
    alignItems="stretch"
    >
      <Box flexGrow={1} order={0} className={classes.container}>
        {speeches}
        <div ref={myRef}></div>
      </Box>
      <Box order={0} justifyContent="center">
        <Console
          position={0}
          handleWriteMessage={handleWriteMessage}/>
      </Box>
    </Box>  
  )
}