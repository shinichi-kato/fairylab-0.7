import React ,{useState,useEffect,createContext,useReducer} from 'react';

import AuthDialog from './auth-dialog.jsx';

export const AuthContext = createContext();

const initialState={
  user: {
    displayName: null,
    email: null,
    photoURL: null,
    uid: null,
    emailVerified: null,
    providerData: null,
  },
	authState: 'notYet',	// notYet - run - ok - error
	message: '',	// error message
}

function reducer(state,action){
	switch(action.type){
		case 'run': {
			return {
				user:initialState.user,
				authState:'run',
				message: '',
			}
		}
		case 'authOk': {
			return {
				user:action.user,
				authState:'ok',
				message: ''
			}
		}
		case 'success':{
			return {
				user:state.user,
				authState:'success',
				message:action.message,
			}
		}
		case 'error': {
			return {
				user:initialState.user,
				authState:'error',
				message: action.message,
			}
		}
		default :
			throw new Error(`invalid action ${action.type}`);
	}
}

export default function AuthProvider(props){
	const firebase = props.firebase;
	const [state,dispatch] = useReducer(reducer,initialState);
	const [page,setPage] = useState(false);


	useEffect(()=>{
		let isAlive = true;
		if(isAlive){
			if(state.authState === 'notYet'){
				dispatch({type:'run'});
				setPage("signIn");
				firebase.auth().onAuthStateChanged(user=>{
					if(user){
						dispatch({type:'authOk',user:user});
					}else {
						dispatch({type:'error',message:'ユーザが認証されていません'});
					}

				})
			}
		}

		return (()=>{ isAlive = false});
	},[]);

	function handleSignIn(email,password){
		dispatch({type:'run'});
		firebase.auth().signInWithEmailAndPassword(email,password)
    .then(()=>{
			setPage(false);
		})
		.catch(error=>{
			switch(error.code){
				case 'auth/user-not-found':
					dispatch({type:'error',message:"ユーザが登録されていません"});
					break;
				case 'auth/wrong-password' :
					dispatch({type:'error',message:"パスワードが違います"});
					break;
				case 'auth/invalid-email' :
					dispatch({type:'error',message:"不正なemailアドレスです"});
					break;
				default:
					dispatch({type:'error',message:error.message});
			}
		});
	}

	function handleCreateUser(email,password){
		dispatch({type:'run'});
		firebase.auth().createUserWithEmailAndPassword(email,password)
		.then(user=>{
			setPage('changeInfo');
		})
		.catch(error=>{
			dispatch({type:'error',message:error.message})
		})
	}

	function handleChangeUserInfo(displayName,photoURL){
		let user = firebase.auth().currentUser;
		if(user){
			user.updateProfile({
				displayName:displayName,
				photoURL: photoURL
			}).then(()=>{
				// userの更新はonAuthStateChangedで検出
				setPage(false);
			}).catch(error=>{
				dispatch({type:'error',message:error.code});
			})
		}
	}

	
	return (
		<AuthContext.Provider value={{
			user:state.user,
			authState:state.authState,
			handleChangeUserInfo:()=>handleChangeUserInfo(),
		}}>
			{page !== false	?
				<AuthDialog 
					user={state.user}
					authState={state.authState}
					message={state.message}
					page={page}
					handleSignIn={handleSignIn}
					handleCreateUser={handleCreateUser}
					handleChangeUserInfo={handleChangeUserInfo} /> 
				:
				props.children
			}
		</AuthContext.Provider>
	)
}