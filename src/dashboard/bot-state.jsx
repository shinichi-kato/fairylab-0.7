import React ,{useContext} from 'react';
import { makeStyles,createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import {BotContext} from '../biome-bot/bot-provider.jsx';

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
  const bot = useContext(BotContext);
  const state = bot.state;

  return(
    <Box display="flex"
      flexDirection="column">
      <Box alignSelf="center">
        <Avatar
          className={classes.avatar}
          src={state.photoURL} />
      </Box>
      <Box alignSelf="center">
        <Typography>
          {state.displayName}
        </Typography>
      </Box>
    </Box>
  )
}