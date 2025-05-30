import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCtfCQ7g7Yzhwqj4PxB7wqD33DB_joDuY",
  authDomain: "mear-blogging.firebaseapp.com",
  projectId: "mear-blogging",
  storageBucket: "mear-blogging.firebasestorage.app",
  messagingSenderId: "1063770951269",
  appId: "1:1063770951269:web:c539e21987d1f869f2408c",
};

// Initialize Firebase
initializeApp(firebaseConfig);

//google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  const user = await signInWithPopup(auth, provider);

  return user;
};
