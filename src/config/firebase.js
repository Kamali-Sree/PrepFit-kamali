import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBeVL8oOkoTBYcdl2dpm1LAnIPC0YmOitE",
  authDomain: "prepfit-84905.firebaseapp.com",
  projectId: "prepfit-84905",
  storageBucket: "prepfit-84905.appspot.com",
  messagingSenderId: "626966345598",
  appId: "1:626966345598:web:06f03cd9705f6083fd652f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const loginWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

export const logout = () => {
  return signOut(auth);
};
