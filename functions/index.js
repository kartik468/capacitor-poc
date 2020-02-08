const admin = require('firebase-admin');
var serviceAccount = require('./karpwa-dea36-firebase-adminsdk-h0bdw-f1092bd079.json');
var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://karpwa-dea36.firebaseio.com'
});

const payload = {
  notification: {
    title: `New Message`,
    body: 'Message received with test body'
  }
};

let firestore = admin.firestore();

// firestore.listCollections().then(collections => {
//   for (let collection of collections) {
//     console.log(`Found collection with id: ${collection.id}`);
//   }
// });

let fcmTokens = [];
let users = firestore.collection('users');
users.get().then(querySnapshot => {
  querySnapshot.forEach(userDoc => {
    console.log(`Found document at ${userDoc.ref.path}`);
    const fcmTokenCollRef = userDoc.ref.collection('fcmTokens');
    fcmTokenCollRef.get().then(tokens => {
      tokens.forEach(token => {
        tokenData = token.data();
        fcmTokens.push(tokenData.token);
      });
      console.log(fcmTokens);
      admin
        .messaging()
        .sendToDevice(fcmTokens, payload)
        .then(response => {
          console.log(response);
        });
    });
  });
});
