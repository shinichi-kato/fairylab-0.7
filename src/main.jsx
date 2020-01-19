import React ,{useState}from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import ApplicationBar from './application-bar/application-bar.jsx';
import Dashboard from './dashboard/dashboard.jsx';
import ScriptEditor from './editor/script-editor.jsx';
import UserSettings from './authentication/user-settings.jsx';

const useStyles = makeStyles(theme => ({
  container: {
   height:'calc( 100vh - 64px )',
   overflowY:'scroll',
   overscrollBehavior:'auto',
   WebkitOverflowScrolling:'touch',
   padding: 0,
   margin: 0,
 },
}));

const parentPage={
	'Dashboard' : 'Dashboard',
	'UserSettings' : 'Dashboard',
	'ScriptEditor' : 'Dashboard',
}

export default function Main(props){
	const classes = useStyles();
	const [currentPage,setCurrentPage] = useState('Dashboard');
	const [currentPart,setCurrerntPart] = useState('');

	function handleToParentPage(){
		if (currentPage in parentPage){
			setCurrentPage(parentPage[currentPage]);
		}else{
			throw new Error(`page "${currentPage}" had no valid parent.`)
		}
	}

	function handleToPartEditor(name){
		setCurrerntPart(name);

	}


	 
	const mainView = {
		'Dashboard' : ()=>(
			<Dashboard 
				
			/>
		),
		'UserSettings': ()=>(
			<UserSettings 
				toParentPage={handleToParentPage}
			/>
		),
		'ScriptEditor' : ()=>(
			<ScriptEditor 
				handleClose={handleToParentPage}
				toParentPage={handleToParentPage}
				toPartEditor={handleToPartEditor}
			/>
		),
	} 

	function handleChangePage(page){
		setCurrentPage(page);
	}

	return(
		<Box display="flex"
			flexDirection="column"
			flexWrap="nowrap"
			justifyContent="space-between"
			height="100%">
			<Box >
				<ApplicationBar 
					currentPage={currentPage}
					handleChangePage={handleChangePage}
					toParentPage={handleToParentPage}

				/>
			</Box>
			<Box className={classes.container}>
				{ currentPage in mainView ?
					mainView[currentPage]
					:
					<div>Invalid page `{currentPage}` </div>
				}
			</Box>
		</Box>
	)
}