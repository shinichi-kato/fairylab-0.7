import React,{useState} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => createStyles({
	root: {
		flexGrow: 1,
		padding: theme.spacing(2),
		height:'calc( 100vh - 64px   )',
		overflowY:'scroll',
		overscrollBehavior:'auto',
		WebkitOverflowScrolling:'touch',
	},
	caption: {
		
	},
	textField: {
		padding: "2px 4px",
		backgroundColor:"#E0E0E0",

	},
	readOnlyField:{
		padding: theme.spacing(1),
		backgroundColor:"#C0C0C0",	
	},
	wideButton:{
		width: "100%",
	}
}));


export default function MemoryEditor(props){
  /* 
    メモリの内容を編集する。
    bot.memoryには
    ・パートの順番情報（readonly)
    ・会話の中で生成される記憶(readonly)
    ・人称
        inDictWordsForBot:[
          '{botName}さん','{botName}君','{botName}氏',
          '{botName}','あなた','おまえ','君'],
        inDictWordsForUser:[
          '{userName}','私','僕','俺'],
        outDictBotInWords:[
          '{botName}','私'
        ],
        outDictUserInWords:[
          '{userName}さん','あなた',
        ],
    ・ユーザが設定する記憶
    がある。これらのうちパートの順番情報と会話で生成される記憶は
    表示だけし、人称とユーザが設定する記憶はjson形式で一括入力
    する。
  */
  const classes = useStyles();
  const [inDictWordsForBot,setInDictWordsForBot]=useState(
    JSON.stringify(props.memory.inDictWordsForBot));

  const [inDictWordsForUser,setInDictWordsForUser]=useState(
    JSON.stringify(props.memory.inDictWordsForUser));

  const [outDictBotInWords,setOutDictBotInWords]=useState(
    JSON.stringify(props.memory.outDictBotInWords));
    
  const [outDictUserInWords,setOutDictUserInWords]=useState(
    JSON.stringify(props.memory.outDictUserInWords));
  
  const [tagDict,setTagDict] = useState(
    JSON.stringify(props.memory.tags));

  const [message,setMessage] = useState("");

  function handleChangeTagDict(tagDict){
    setTagDict(tagDict);
    try {
      
    } catch (error) {
      
    }
  }

  function handleUpdate(){
    const dict = {
      inDictWordsForBot:JSON.parse(inDictWordsForBot),
      inDictWordsForUser:JSON.parse(inDictWordsForUser),
      outDictBotInWords:JSON.parse(outDictBotInWords),
      outDictUserInWords:JSON.parse(outDictUserInWords),
      tags:JSON.parse(tagDict),
    }

    props.handleChangeMemory(dict);
  }

  return(
    <Grid container
      className={classes.root}
      spacing={1}
      alignContent="flex-start">
      <Grid item xs={5}>
        <Typography variant="body2">
          {props.botName}を指す二人称
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Paper calssName={classes.textField}>
          <InputBase
            id="inDictWordsForBot"
            value={inDictWordsForBot}
            fullwidth
            onChange={e=>setInDictWordsForBot(e.target.value)}
            />
        </Paper>
      </Grid>
      <Grid item xs={5}>
        <Typography variant="body2">
          {props.userName}を指す一人称
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Paper calssName={classes.textField}>
          <InputBase
            id="inDictWordsForUser"
            value={inDictWordsForUser}
            fullwidth
            onChange={e=>setInDictWordsForUser(e.target.vlaue)}
            />
        </Paper>
      </Grid>  
      <Grid item xs={5}>
        <Typography variant="body2">
          {props.botName}を指す一人称
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Paper calssName={classes.textField}>
          <InputBase
            id="outDictBotInWords"
            value={outDictBotInWords}
            fullwidth
            onChange={e=>setOutDictBotInWords(e.target.value)}
            />
        </Paper>
      </Grid> 
      <Grid item xs={5}>
        <Typography variant="body2">
          {props.userName}を指す二人称
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Paper calssName={classes.textField}>
          <InputBase
            id="outDictUserInWords"
            value={outDictUserInWords}
            fullwidth
            onChange={e=>setOutDictUserInWords(e.target.value)}
            />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Typography>記憶：json形式の辞書</Typography>
      <Paper className={classes.textField}>
        <InputBase 
          id="tagdict"
          placeholder="例：[[[&quote;こんにちは&quote;],[&quote;よろしく！\&quote;],[[&quote;&quote;],[&quote;&quote;]]]"
          fullWidth
          multiline
          rows={22}
          value={tagDict}
          onChange={e=>setTagDict(e.target.value)}
        />
        </Paper>   
        {
          message === null ?
          <Typography variant="caption">エラーはありません</Typography>
          :
          <Typography variant="caption" color="error">{message}</Typography>
        }
      </Grid>
      <Grid item xs={12}>
      <Button 
          className={classes.middleButton}
          size="large"
          variant="contained"
          color="primary"
          onClick={e=>handleUpdate()}>
          OK
        </Button>
      </Grid>
    </Grid>
  );
}