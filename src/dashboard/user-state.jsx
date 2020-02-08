import React ,{useContext} from 'react';
import { makeStyles,createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import {AuthContext} from '../authentication/auth-provider.jsx';

const useStyles = makeStyles(theme => createStyles({
  root: {
    height: 180,
    width: '60%',
    margin: 'auto'
  },
  char: {
    textAlign: 'center'
  },
  avatar: {
    width: 100,
    height: 100
  },
  name: {
    size: 16,
    textAlign: "center",
  }

}));


export default function UserState(props){
  const classes=useStyles();
  const auth = useContext(AuthContext);
  const user = auth.user;

  return(
    <Box display="flex"
      flexDirection="column">
      <Box alignSelf="center">
        <Avatar
          className={classes.avatar}
          src={user.photoURL} />
      </Box>
      <Box alignSelf="center">
        <Typography>
          {user.displayName}
        </Typography>
      </Box>
    </Box>
  )
}