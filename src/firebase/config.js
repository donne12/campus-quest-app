import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDPFwbFBfidga_xjTIzjuUTyIbJc6VA15U",
    authDomain: "campus-quest-9fbef.firebaseapp.com",
    projectId: "campus-quest-9fbef",
    storageBucket: "campus-quest-9fbef.appspot.com",
    messagingSenderId: "794262638488",
    appId: "1:794262638488:web:412db68af976e138fb25ed",
    measurementId: "G-BP2CF6QMGT"
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;