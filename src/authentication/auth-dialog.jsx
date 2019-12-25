import React ,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import PersonIcon from '@material-ui/icons/Person';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import EmailIcon from '@material-ui/icons/Email';

import UserAvatarSelector from './user-avatar-selector.jsx/index.jssx';



// import {useLocalStorage} from 'react-use';

const useStyles = makeStyles(theme => ({
  root: {
   padding:theme.spacing(2)
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
	const page= props.page;
	const [email,setEmail] = useState("");
	const [password,setPassword] = useState("");
	const [displayName,setDisplayName] = useState("");
	const [photoURL,setPhotoURL] = useState("");
	
	const page1NotReady = 
		password === "" || email === "" || props.authState === 'run'; 
	const page2NotReady = 
		displayName === "" || photoURL === "" || props.authState === 'run';

	function handleRegisterStep1(e){
		// emailとpasswordでユーザ登録
		props.handleCreateUser(email,password);
	}
	
	function handleRegisterStep2(e){
		// 現ユーザの表示名とavatarを更新
		props.handleChangeUserInfo(displayName,photoURL);
		
	}

	return (
		<Box display="flex" flexDirection="column">
			<Box>
				<Typography variant="h4>">
					ようこそ！
				</Typography>
			</Box>
			<Box>
				<TextField 
					id="email"
					placeHolder="E-mail"
					readOnly={registerMode}
					InputAdornment={{
						startAdornment: (
							<InputAdornment position="start">
								<EmailIcon />
							</InputAdornment>	
						)
					}}
					value={email}
					onChange={e=>{setEmail(e.target.value)}}
				/>
			</Box>
			<Box>
				<TextField 
						id="password"
						variant="password"
						placeHolder="Password"
						readOnly={registerMode}
						InputAdornment={{
							startAdornment: (
								<InputAdornment position="start">
									<VpnKeyIcon />
								</InputAdornment>	
							)
						}}
						value={password}
						onChange={e=>{setPassword(e.target.value)}}
					/>
			</Box>

			{ page === 'signIn' &&
				<>
					<Box>
						<Button 
							fullWidth
							disabled = {page1NotReady}
							variant="contained" 
							color="primary"
							onClick={handleSignIn}
							>
							サインイン
						</Button>
					</Box>
					<Box>
						<Button
							onClick={handleRegisterStep1}
							fullWidth
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
							placeHolder="ユーザの名前"
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
							onClick={e=>{props.handleRegisterStep2}}
							>
							新規ユーザー登録
						</Button>
					</Box>
				</>
			}

		</Box>
	)
}