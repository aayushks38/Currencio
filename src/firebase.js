import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAy-8hZ7TZAy0hjURHALTFc8mpJHWHs8w",
  authDomain: "expense-tracker-299c1.firebaseapp.com",
  projectId: "expense-tracker-299c1",
  storageBucket: "expense-tracker-299c1.firebasestorage.app",
  messagingSenderId: "204602526717",
  appId: "1:204602526717:web:057e9cd0cb5909dface794",
  measurementId: "G-VPDM7BXJNW",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);