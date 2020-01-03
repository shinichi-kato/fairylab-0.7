import React ,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import UserInfo from './user-info.jsx';



// import {useLocalStorage} from 'react-use';

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


export default function AuthDialog(props){
	const classes = useStyles();
	const {user,page} = props;
	const [email,setEmail] = useState(user.email);
	const [password,setPassword] = useState(user.password);
	const [displayName,setDisplayName] = useState(user.dispalyName);
	const [photoURL,setPhotoURL] = useState(user.photoURL);

	
	const page1NotReady = 
		password === "" || email === "" || props.authState === 'run'; 
	const page2NotReady = 
		displayName === "" || photoURL === "" || props.authState === 'run';

	const registerMode = page === 'changeInfo';
	
	function handleRegisterStep1(e){
		// emailとpasswordでユーザ登録
		props.handleCreateUser(email,password);
	}
	
	function handleRegisterStep2(e){
		// 現ユーザの表示名とavatarを更新
		props.handleChangeUserInfo(displayName,photoURL);
		
	}
	
	function handleSignIn(e){
		props.handleSignIn(email,password);
	}

	return (
		<div className={classes.root}>
			<Box display="flex" flexDirection="column"
				alignItems="center"
				borderRadius={10}
				className={classes.card}
			>
				<Box className={classes.items}>
					<Typography variant="h3">
						ようこそ！
					</Typography>
				</Box>
				<Box className={classes.items}
					display="flex" flexDirection="row" alignItems="center"
				>
					<Box>
						<EmailIcon />
					</Box>
					<Box className={classes.items}>
						<TextField 
							className={classes.textField}
							id="email"
							placeholder="E-mail"
							fullWidth
							readOnly={registerMode}
							value={email}
							onChange={e=>{setEmail(e.target.value)}}
						/>
					</Box>
				</Box>
				<Box className={classes.items}
					display="flex" flexDirection="row" alignItems="center"
				>
					<Box>
						<VpnKeyIcon />
					</Box>
					<Box className={classes.items}>
						<TextField 
								className={classes.textField}
								id="password"
								type="password"
								fullWidth
								placeholder="Password"
								readOnly={registerMode}
								value={password}
								onChange={e=>{setPassword(e.target.value)}}
							/>
					</Box>

				</Box>

				{ page === 'signIn' &&
					<>
						<Box className={classes.items}>
							<Typography variant="subtext">
								{props.message}
								{props.authState}
							</Typography>
							<Button 
								fullWidth
								size="large"
								disabled = {page1NotReady}
								variant="contained" 
								color="primary"
								onClick={handleSignIn}
								>
								サインイン
							</Button>
						</Box>
						<Box className={classes.items}>
							<Button
								onClick={handleRegisterStep1}
								fullWidth
								size="large"
								disabled={page1NotReady}>
								新規ユーザー登録する
							</Button>

						</Box>
					</>
				}
				{ page === 'changeInfo' && 
					<>
						<Box>
							<UserInfo 
							photoURL={photoURL}
							handleChangePhotoURL={setPhotoURL}
							displayName={displayName}
							handleChangeDisplayName={setDisplayName}
							/>
						</Box>
						<Box>
							<Button 
								fullWidth
								disabled = {page2NotReady}
								variant="contained" 
								color="primary"
								onClick={handleRegisterStep2}
								>
								新規ユーザー登録
							</Button>
						</Box>
					</>
				}

			</Box>
		</div>
	)
}