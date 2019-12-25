import React ,{useState,useEffect} from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';



import AuthProvider from './authentication/auth-provider.jsx';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {firebaseConfig} from './credentials/firebase-init.js';
const app=firebase.initializeApp(firebaseConfig);


const theme = createMuiTheme({
  palette: {
    primary: { main: '#0D47A1' },
    secondary: { main: '#BF360C' },
    background: { default: '#ffe032'}
  },

});


export default function App() {

  //------------------------------------------------------------------
  //  body要素のバウンススクロールを無効化

  useEffect(() => {
    const handler = (event) => {
      if (handler.event.touches[0].target.tagName.toLowerCase() === "body"){
        event.preventDefault();
      }
    }

    window.addEventListener("touchstart",handler);
    window.addEventListener("touchmove",handler);
    window.addEventListener("touchend",handler);

    return () => {
      window.removeEventListener("touchstart",handler);
      window.removeEventListener("touchmove",handler);
      window.removeEventListener("touchend",handler);
    }
  },[]);

  return (
    <ThemeProvider theme={theme} >
      <AuthProvider firebase ={firebase}>

      </AuthProvider>
    </ThemeProvider>
  );
}

