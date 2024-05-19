import { initializeApp } from 'firebase/app';
//import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBg7EgyON3H58t9aueoRsHCiUKp-j9Jdf0",
    authDomain: "ar-furniture-789f5.firebaseapp.com",
    databaseURL: "https://ar-furniture-789f5-default-rtdb.firebaseio.com",
    projectId: "ar-furniture-789f5",
    storageBucket: "ar-furniture-789f5.appspot.com",
    messagingSenderId: "577430674846",
    appId: "1:577430674846:web:2b7085265eaed1a558ca8f",
    measurementId: "G-N687J0JPYZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

// Google authentication
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log(result.user);
        })
        .catch((error) => {
            console.error(error);
        });
};

export { app, auth, storage, db, provider };