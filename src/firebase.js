import * as firebase from "firebase/app";
import "firebase/auth";
// import "firebase/database";
import "firebase/firestore";

const firebaseConfig = {
    // apiKey: "AIzaSyARHVg1YFtcWiKYN3FpYKqXUgDYAN_a4Vk",
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "dividend-portfolio-2f4a2.firebaseapp.com",
    databaseURL: "https://dividend-portfolio-2f4a2.firebaseio.com",
    projectId: "dividend-portfolio-2f4a2",
    storageBucket: "dividend-portfolio-2f4a2.appspot.com",
    messagingSenderId: "958239183722",
    appId: "1:958239183722:web:da8b465431e9e8d9100b13",
    measurementId: "G-5JVP2TL255"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

  export default firebase;