import React ,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import Close from '@material-ui/icons/Close';

import AppMenu from './app-menu.jsx';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    alignSelf: "center",
  },
}));


export default function ApplicationBar(props){
  const {currentPage,ToParentPage} = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton 
            edge="start"
            disable={currentPage === 'Dashboard'}
            onClick={e=>props.ToParentPage()}
            color="inherit" >
            <NavigateBefore />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            { currentPage }
          </Typography>
          <AppMenu
            pageHandlers={props.menuPageHandlers}
          />
        </Toolbar>
        
      </AppBar>
    </div>
  )
}