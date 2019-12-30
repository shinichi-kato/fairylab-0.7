import React ,{useState}from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import ApplicationBar from './application-bar/application-bar.jsx';
import Dashboard from './dashboard/dashboard.jsx';
import ScriptEditor from './editor/script-editor.jsx';

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
	'Dashboard' : null,
	'ScriptEditor' : 'Dahsboard',
}

export default function Main(props){
	const classes = useStyles();
	const [currentPage,setCurrentPage] = useState('Dashboard');

	function handleToParentPage(){
		if (currentPage in parentPage){
			setCurrentPage(parentPage[currentPage]);
		}else{
			throw new Error(`page "${currentPage}" had no valid parent.`)
		}
	}


	 
	const mainView = {
		'Dashboard' : ()=>(
			<Dashboard />
		),
		'ScriptEditor' : ()=>(
			<ScriptEditor 
				handleClose={handleToParentPage}
				ToParentPage={handleToParentPage}
			/>
		),
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
					menuPageHandlers={{
						'ScriptEditor':()=>setCurrentPage('ScriptEidor')
					}}
					toParentPage={handleToParentPage}

				/>
			</Box>
			<Box className={classes.container}>
				{ currentPage in mainView ?
					mainView[currentPage]
					:
					<div>Error</div>
				}
			</Box>
		</Box>
	)
}