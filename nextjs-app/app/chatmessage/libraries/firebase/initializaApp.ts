import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore, initializeFirestore } from 'firebase/firestore';
// import { Auth, getAuth, initializeAuth } from 'firebase/auth';
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAC_rE5BPcJiuusu1dUD7vbvWFHtUGSsmc",
  authDomain: "chat-message-331da.firebaseapp.com",
  projectId: "chat-message-331da",
  storageBucket: "chat-message-331da.firebasestorage.app",
  messagingSenderId: "940420138396",
  appId: "1:940420138396:web:815d2d1bdaa2c86ae23459",
  measurementId: "G-4X4DZRS23F"
};

let firebaseApp: FirebaseApp;
// let fireAuth: Auth;
let fireStore: Firestore;
// let fireStorage: FirebaseStorage;

if (getApps().length < 1) {
  firebaseApp = initializeApp(firebaseConfig);
  fireStore = initializeFirestore(firebaseApp, {
    experimentalForceLongPolling: true,
  });
  // fireAuth = initializeAuth(firebaseApp, {
  //   persistence: {
  //     type: 'LOCAL',
  //   },
  // });
} else {
  firebaseApp = getApp();
  // fireAuth = getAuth();
  fireStore = getFirestore();
}

// Initialize Firebase
export const app = firebaseApp;
export const db = fireStore;
// export const auth = fireAuth;