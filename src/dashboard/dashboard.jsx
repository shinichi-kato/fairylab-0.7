import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';



import UserState from './user-state.jsx';
import BotState from './bot-state.jsx';

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
	docContainer: {
		paddingTop: theme.spacing(5),
		paddingBottom: theme.spacing(5),
	}
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
				justifyContent="space-around"
			>
				<Box>
					<UserState />
				</Box>
				<Box>
					<BotState />
				</Box>
			</Box>
			<Box className={classes.docContainer}
				alignSelf="center"
			>
				<Typography variant="h5">
				
				<Link 
					href="docs/index.html" 
					color="primary"
					target="_blank"
					rel="noopener">
				<ImportContactsIcon/>チャットボットのしくみ
				</Link>
				</Typography>
				
				 
			</Box>
			<Box 
				display="flex"
				flexDirection="row"
				justifyContent="space-between"
			>
				<Box className={classes.buttonContainer}>
					<Button className={classes.homeButton}
						onClick={props.toHome}
					>
						<img 
							className={classes.buttonImage} 
							src="icons/home.svg" alt="HOME"/>
					</Button>
				</Box>
				<Box className={classes.buttonContainer}>
					<Button className={classes.hubButton}
						onClick={props.toHub}
					>
						<img 
							className={classes.buttonImage} 
							src="icons/hub.svg" alt="HUB"/>
					</Button>
				</Box>

			</Box>
		</Box>
	)
}