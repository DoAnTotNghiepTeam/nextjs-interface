import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWVDjP4mCYgDkDQR36OMGzqw7TUcS3zJY",
  authDomain: "work-wise-1fc2e.firebaseapp.com",
  projectId: "work-wise-1fc2e",
  storageBucket: "work-wise-1fc2e.firebasestorage.app",
  messagingSenderId: "954190400565",
  appId: "1:954190400565:web:321d47c4680c20b981357c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };