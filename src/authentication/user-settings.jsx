import React ,{useState,useContext} from 'react';
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
  console.log("auth=",auth);
  const user = auth.user;
  const [displayName,setDisplayName] = useState(user.displayName);
  const [photoURL,setPhotoURL] = useState(user.photoURL);

  function handleChangeUserInfo(){
    auth.handleChangeUserInfo(displayName,photoURL);
    props.toParentPage();
  }

  return(
    <Box 
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={classes.root}>
      <Box>
        <Typography variant="h4">
          ユーザ情報設定
        </Typography>
      </Box>
      <Box>
        <Typography >
          <EmailIcon/>{auth.user.email}
        </Typography>
      </Box>
      <Box>
        <UserInfo 
          photoURL={photoURL}
          handleChangePhotoURL={setPhotoURL}
          displayName={displayName}
          handleChangeDisplayName={setDisplayName}
        />
      </Box>
      <Box className={classes.items}>
        {auth.authState}
        <Button
          onClick={handleChangeUserInfo}
          fullWidth
          variant="contained"
          color="primary"
          size="large">
          ユーザ設定を変更する
        </Button>

      </Box>
      <Box className={classes.items}>
        <Button
          onClick={props.ToParentPage}
          fullWidth
          size="large">
          キャンセル
        </Button>

      </Box>
    </Box>
  )
}