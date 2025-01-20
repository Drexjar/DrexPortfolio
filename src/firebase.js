// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBx-xauYd2HivXT982DJPNwCB49I-OAcmw",
  authDomain: "my-portfolio-c6d05.firebaseapp.com",
  projectId: "my-portfolio-c6d05",
  storageBucket: "my-portfolio-c6d05.firebasestorage.app",
  messagingSenderId: "858589242432",
  appId: "1:858589242432:web:a660f4e0898d560a44eba5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore DB
export const db = getFirestore(app);
