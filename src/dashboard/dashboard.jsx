import React,{useState,useContext} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import UserState from './user-state.jsx';

const useStyles = makeStyles(theme => createStyles({
  root: {
    flexGrow: 1,

  },
  homeButton: {
    width: 180,
    height: 180,
    margin: 'auto',
    padding: 'auto 10',
    borderRadius: '0% 100% 100% 0% / 100% 100% 0% 0% ',
    backgroundColor: theme.palette.primary.main
  },
  hubButton: {
    width: 180,
    height: 180,
    margin: 'auto',
    padding: 'auto 10',
    borderRadius: '100% 0% 0% 100% / 100% 100% 0% 0% ',
    backgroundColor: theme.palette.primary.main,
  },
  buttonImage: {
    width: 90,
    height: 90
	},
	buttonContainer: {
	},
 }));

export default function Dashboard(props){
	const classes = useStyles();

	return(
		<Box
			display="flex"
			flexDirection="column"
			flexWrap="nowrap"
			>
			<Box flexGrow={1}
				display="flex"
				flexDirection="row"
			>
				<Box>
					<UserState />
				</Box>
				<Box>
					BotState
				</Box>
			</Box>
			<Box 
				display="flex"
				flexDirection="row"
				justifyContent="space-between"
			>
				<Box className={classes.buttonContainer}>
					<Button className={classes.homeButton}>
						<img 
							className={classes.buttonImage} 
							src="icons/home.svg" alt="HOME"/>
					</Button>
				</Box>
				<Box className={classes.buttonContainer}>
					<Button className={classes.hubButton}>
						<img 
							className={classes.buttonImage} 
							src="icons/hub.svg" alt="HUB"/>
					</Button>
				</Box>

			</Box>
		</Box>
	)
}