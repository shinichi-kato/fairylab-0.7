import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import NavigateBefore from '@material-ui/icons/NavigateBefore';

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
  const {currentPage,toParentPage} = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton 
            edge="start"
            disabled={currentPage === 'Dashboard'}
            onClick={e=>toParentPage()}
            color="inherit" >
            <NavigateBefore />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            { currentPage }
          </Typography>
          <AppMenu
            handleChangePage={props.handleChangePage}
          />
        </Toolbar>
        
      </AppBar>
    </div>
  )
}