// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA59FtyY0eF4vTmm2xdhBIcZRfrmtHQaq0",
  authDomain: "ews-dashboard-3d185.firebaseapp.com",
  projectId: "ews-dashboard-3d185",
  storageBucket: "ews-dashboard-3d185.firebasestorage.app",
  messagingSenderId: "437173517420",
  appId: "1:437173517420:web:ef089cb3ae798a9690ec49",
  measurementId: "G-5MCH5LCG41"
};

import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);