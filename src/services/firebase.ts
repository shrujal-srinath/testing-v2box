import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your BMSCE config
const firebaseConfig = {
  apiKey: "AIzaSyCOxfphialDsr8jrwU7Cad2bfakM_2n1H0", 
  authDomain: "bmsce-box.firebaseapp.com",
  projectId: "bmsce-box",
  storageBucket: "bmsce-box.firebasestorage.app",
  messagingSenderId: "705333337179",
  appId: "1:705333337179:web:9018e93764205c6f33337e",
  measurementId: "G-P6VC5RQRDY"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();