import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXY7g9gBxMOuap-U08iyRN1CDyXnw4Htw",
  authDomain: "gen-lang-client-0941201085.firebaseapp.com",
  projectId: "gen-lang-client-0941201085",
  storageBucket: "gen-lang-client-0941201085.firebasestorage.app",
  messagingSenderId: "194775005637",
  appId: "1:194775005637:web:04b4a5a2e7f97595fc73ac"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Use Google Auth Provider for Google Sign-In
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore using the custom database ID
export const db = getFirestore(app, "ai-studio-f36430a3-85e0-4dc4-9e09-cffa47ecd03c");

export { signInWithPopup, signOut, onAuthStateChanged, signInAnonymously };
export type { User };
