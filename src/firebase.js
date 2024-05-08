// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBg7EgyON3H58t9aueoRsHCiUKp-j9Jdf0",
  authDomain: "ar-furniture-789f5.firebaseapp.com",
  databaseURL: "https://ar-furniture-789f5-default-rtdb.firebaseio.com",
  projectId: "ar-furniture-789f5",
  storageBucket: "ar-furniture-789f5.appspot.com",
  messagingSenderId: "577430674846",
  appId: "1:577430674846:web:2b7085265eaed1a558ca8f",
  measurementId: "G-N687J0JPYZ"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;