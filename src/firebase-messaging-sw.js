importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-messaging.js');
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
firebase.initializeApp({
  apiKey: "AIzaSyB_wVRX6Zy8t8OC5-XTMyrhupnGpDSaCs8",
  authDomain: "hacettepe-rehabsoft.firebaseapp.com",
  projectId: "hacettepe-rehabsoft",
  storageBucket: "hacettepe-rehabsoft.appspot.com",
  messagingSenderId: "587391793988",
  appId: "1:587391793988:web:da61147f487344f206b511",
  measurementId: "G-PMNQT97CCE"
});
const messaging = firebase.messaging();
