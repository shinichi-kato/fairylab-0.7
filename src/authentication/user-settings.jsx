import React ,{useState,useEffect,useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EmailIcon from '@material-ui/icons/Email';

import {AuthContext} from './auth-provider.jsx';

import UserInfo from './user-info.jsx';

const useStyles = makeStyles(theme => ({
  root: {
   padding:theme.spacing(2)
 },
 card: {
	 padding:theme.spacing(2),
	 background:theme.palette.background.paper
 },
 items: {
	 padding:theme.spacing(1),
	 width: "80%",
 },
 textField: {
   width: "100%",
 },
 wideButton: {
  width: "100%",
  padding: 16,
  },
}));

export default function UserSettings(props){
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const user = auth.user;
  const [displayName,setDisplayName] = useState(user.displayName);
  const [photoURL,setPhotoURL] = useState(user.photoURL);

  useEffect(()=>{
    auth.handleGetReady();
  },[]);

  function handleEngage(e){
    if(auth.authState==='ready'){
      auth.handleChangeUserInfo(displayName,photoURL);
    }else{
      props.toParentPage();
    }
 

  }

  return(
    <Box 
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={classes.root}>
      <Box className={classes.items}>
        <Typography variant="h4">
          ユーザ情報設定
        </Typography>
      </Box>
      <Box className={classes.items}>
        <Typography >
          <EmailIcon/>{auth.user.email}
        </Typography>
      </Box>
      <Box className={classes.items}>
        <UserInfo 
          photoURL={photoURL}
          handleChangePhotoURL={setPhotoURL}
          displayName={displayName}
          handleChangeDisplayName={setDisplayName}
        />
      </Box>
      <Box className={classes.items}>
        {auth.authState}{auth.message}
        <Button
          onClick={handleEngage}
          fullWidth
          variant="contained"
          color="primary"
          size="large">
          {auth.authState==="ready" ? 
            "ユーザ設定を変更する"
            :
            "完了"
          }
        </Button>

      </Box>
      <Box className={classes.items}>
        <Button
          onClick={props.toParentPage}
          fullWidth
          size="large">
          キャンセル
        </Button>

      </Box>
    </Box>
  )
}