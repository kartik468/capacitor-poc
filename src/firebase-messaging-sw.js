importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-messaging.js');

firebase.initializeApp({
    messagingSenderId: '311785159077'
  });

const messaging = firebase.messaging();
