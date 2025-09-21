// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8LZHLwg9XGPKlSbRXfftwxDd9UA8iDlI",
  authDomain: "carrier-b69f6.firebaseapp.com",
  projectId: "carrier-b69f6",
  storageBucket: "carrier-b69f6.appspot.com",
  messagingSenderId: "797552351560",
  appId: "1:797552351560:web:2cebf6b665acac66c4fb7d",
  measurementId: "G-MBS91QS5DF"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
let analytics;

// Initialize Analytics only in client-side and if supported
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

export { auth, db, provider, analytics };
