import React ,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';

import PersonIcon from '@material-ui/icons/Person';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import EmailIcon from '@material-ui/icons/Email';

import UserAvatarSelector from './user-avatar-selector.jsx';



// import {useLocalStorage} from 'react-use';

const useStyles = makeStyles(theme => ({
  root: {
   padding:theme.spacing(2)
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
	
	const page= props.page;
	const [email,setEmail] = useState("");
	const [password,setPassword] = useState("");
	const [displayName,setDisplayName] = useState("");
	const [photoURL,setPhotoURL] = useState("");

	
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
		<Box display="flex" flexDirection="column"
			alignItems="center"
			className={classes.root}
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
						<TextField 
							id="dispalyName"
							placeholder="ユーザの名前"
							InputAdornment={{
								startAdornment: (
									<InputAdornment position="start">
										<PersonIcon />
									</InputAdornment>	
								)
							}}
							value={displayName}
							onChange={e=>{setDisplayName(e.target.value)}}
						/>						
					</Box>
					<Box>
						<UserAvatarSelector 
							value={photoURL}
							handleChangeAvatar={url=>{setPhotoURL(url)}} />
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
	)
}