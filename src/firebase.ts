// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2HaUHg9gocOKQGrTG3zgFibrzieYbURo",
  authDomain: "managme-24fe0.firebaseapp.com",
  databaseURL: "https://managme-24fe0-default-rtdb.firebaseio.com",
  projectId: "managme-24fe0",
  storageBucket: "managme-24fe0.firebasestorage.app",
  messagingSenderId: "952481172057",
  appId: "1:952481172057:web:f06e95615a3bb588463f48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);