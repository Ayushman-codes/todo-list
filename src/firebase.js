// Import the core Firebase app
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// 1. IMPORT AUTH AND FIRESTORE
import { getFirestore } from "firebase/firestore"; // 👈 ADD THIS

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8QzA_8JdzYFFaAdLDbQx6U1Ddb7Ha9Ds",
  authDomain: "todo-list-495e3.firebaseapp.com",
  projectId: "todo-list-495e3",
  storageBucket: "todo-list-495e3.firebasestorage.app",
  messagingSenderId: "1083374804483",
  appId: "1:1083374804483:web:5c2495f5f2a5dc4064f836",
  measurementId: "G-YFG6RPPQ9P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. EXPORT AUTH AND THE DATABASE
export const auth = getAuth(app);
export const db = getFirestore(app); // 👈 ADD THIS
export const googleProvider = new GoogleAuthProvider();