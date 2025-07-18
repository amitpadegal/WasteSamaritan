import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const signup = async (email: string, password: string, extraData: any) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Store extra user data (like role) in Firestore
  await setDoc(doc(db, "users", userCredential.user.uid), {
    email,
    ...extraData,
    createdAt: new Date().toISOString(),
  });
  return userCredential;
};

export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  // Fetch user role from Firestore
  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
  return { user: userCredential.user, data: userDoc.exists() ? userDoc.data() : null };
};

export const logout = () => {
  return signOut(auth);
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  // Fetch user role from Firestore
  const userDoc = await getDoc(doc(db, "users", result.user.uid));
  return { user: result.user, data: userDoc.exists() ? userDoc.data() : null };
};
