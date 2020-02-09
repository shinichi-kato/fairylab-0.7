const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const Passcode = require('./credentials/passcode.js');

exports.checkPass = functions.https.onRequest((res,req) => {
    if(req.body.passcode === Passcode){
        res.status(200).send("ok")
    }else{
        res.status(200).send("bad")
    }
})