
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import React from "react";



const firebaseConfig = {
  apiKey: "AIzaSyBadhoj6xdjJ3PI6LdGLnCUpag5vC6RZos",
  authDomain: "musique-e0471.firebaseapp.com",
  projectId: "musique-e0471",
  storageBucket: "musique-e0471.appspot.com",
  messagingSenderId: "327955429331",
  appId: "1:327955429331:web:4ab6d2f8edbfe046e36126"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, "users")
getDocs(colRef)
  .then((snapshot) => {
    let users = [];
    snapshot.docs.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id });
    });
    console.log(users);
  })
  .catch((err) => {
    console.error(err.message);
  });

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db, colRef };