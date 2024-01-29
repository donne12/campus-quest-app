import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyB2bE_-VjmYEtqB7EnTJxhSaVIyS88GC1s",
    authDomain: "vote-app-partiel.firebaseapp.com",
    databaseURL: "https://vote-app-partiel-default-rtdb.firebaseio.com",
    projectId: "vote-app-partiel",
    storageBucket: "vote-app-partiel.appspot.com",
    messagingSenderId: "297188183026",
    appId: "1:297188183026:web:3f9d547fb99b6915a4b96b"
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;