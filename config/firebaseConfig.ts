// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHUtkE5FkNImia4XTFpEvx6GyEyjb27_c",
  authDomain: "movies-app-3d98b.firebaseapp.com",
  projectId: "movies-app-3d98b",
  storageBucket: "movies-app-3d98b.firebasestorage.app",
  messagingSenderId: "801940694484",
  appId: "1:801940694484:web:dfbd8942018a952749e241",
  measurementId: "G-XNMBS7JV1H"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app); // A variável 'db' é declarada aqui
// const auth = getAuth(app);

export { db /*, auth */ }; // E é exportada aqui. Isso parece correto.
