// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDWVDjP4mCYgDkDQR36OMGzqw7TUcS3zJY",
//   authDomain: "work-wise-1fc2e.firebaseapp.com",
//   projectId: "work-wise-1fc2e",
//   storageBucket: "work-wise-1fc2e.firebasestorage.app",
//   messagingSenderId: "954190400565",
//   appId: "1:954190400565:web:321d47c4680c20b981357c"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export { db };

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8CKFfVxJyto2PDzibbSnXgDCCxRMXVeA",
  authDomain: "cenima-2300.firebaseapp.com",
  projectId: "cenima-2300",
  storageBucket: "cenima-2300.appspot.com",
  messagingSenderId: "804992089940",
  appId: "1:804992089940:web:bf76dcc2bf5b72831c92c1",
  measurementId: "G-G9QXD9H6ZF"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
