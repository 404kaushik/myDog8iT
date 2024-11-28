// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoMz5o7GoVOyPjJhPSeGsfUjirN9ghF5o",
  authDomain: "brainrothackathon-6ae47.firebaseapp.com",
  projectId: "brainrothackathon-6ae47",
  storageBucket: "brainrothackathon-6ae47.firebasestorage.app",
  messagingSenderId: "745275470212",
  appId: "1:745275470212:web:e7e66f44ee30c2a8a0add1"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// Get a reference to the authentication service
export const auth = getAuth(app);