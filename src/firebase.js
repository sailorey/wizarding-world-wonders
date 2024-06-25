import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCheCd8bGIH0-Vc8ym0B-GhVreGGRdB4qI",
  authDomain: "wizardingworldwonderz.firebaseapp.com",
  projectId: "wizardingworldwonderz",
  storageBucket: "wizardingworldwonderz.appspot.com",
  messagingSenderId: "389611667873",
  appId: "1:389611667873:web:a095d076004cd0cec44be0",
  measurementId: "G-P8EMPLHR2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
