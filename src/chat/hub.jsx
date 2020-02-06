import React,{useState,useCallback,useContext} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const CHAT_WINDOW = 12;

const useStyles = makeStyles(theme => ({
  container: {
   height:'calc( 100vh - 64px - 64px - 2px )',
   overflowY:'scroll',
   overscrollBehavior:'auto',
   WebkitOverflowScrolling:'touch',
   padding: 0
 }
}));


export default function Hub(props){
	/*
	HUB
	firestoreを使ってグループ内でそれぞれのチャットボットが同席して
	チャットを行う。

	*/
	const firebase = props.firebase;
	const classes = useStyles();
	
	const bot = useContext(BotContext);
  const auth = useContext(AuthContext);
	const user = auth.user;

  const [hubLog,setHubLog] = useState([]);
  const botId = `${bot.state.id}@${user.uid}`;


  function handleWriteMessage(text){
    firestore.collection("hubLog").add({
      displayName:user.displayName,
      photoURL:user.photoURL,
      text:text,
      speakerId:user.uid,
      timestamp:firebase.firestore.FieldValue.serverTimestamp()
    });


  }

  //---------------------------------------------------
  // リッスン
  //

  useEffect(()=>{

		// hubのポーリングを開始
		// どこに置くのがいい？
    firestore
      .collection("hubLog")
      .orderBy('timestamp','desc')
      .limit(MAX_HUB_LOG_DISPLAY)
      .onSnapshot(query=>{
        const messages = query.docs.map(doc=>{
          const data = doc.data();
          return {
            ...data,
            timestamp:toTimestampStr(data.timestamp),
            id:doc.id,
          }
        });
        setHubLog(messages.reverse());
        
        // 最後の発言者がボット自身でなければ発言にトライする
        const lastItem = messages[messages.length-1];
        if(lastItem.id !== botId){
          bot.hubReply(text)
          .then(reply=>{
            if(reply.text !== null){
              firestore.collection("hubLog").add({
                displayName:reply.displayName,
                photoURL:reply.photoURL,
                text:reply.text,
                speakerId:botId,
                timestamp:firebase.firestore.FieldValue.serverTimestamp()
              });
            }
          })
        }

      })
    return (()=>{
      firestore.collection("hubLog")
        .onSnaohot(()=>{});
    })
      
  },[])

	// --------------------------------------------------------
  // currentLogが変更されたら最下行へ自動スクロール
  const myRef = useCallback(node => {
    if(node!== null){
      node.scrollIntoView({behavior:"smooth",block:"end"});
    }
  })
  
  const logSlice=hubLog.slice(-CHAT_WINDOW);
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