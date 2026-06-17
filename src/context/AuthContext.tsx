import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously,
  db,
  User
} from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface SimulatedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous?: boolean;
  isSimulated?: boolean;
}

interface AuthContextType {
  user: User | SimulatedUser | null;
  loading: boolean;
  isSimulated: boolean;
  authError: { code: string; message: string; domains: string[] } | null;
  loginWithGoogle: () => Promise<void>;
  loginAnonymously: () => Promise<void>;
  loginWithSimulatedMaker: () => void;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | SimulatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);
  const [authError, setAuthError] = useState<{ code: string; message: string; domains: string[] } | null>(null);

  // Read initial simulated state from localStorage so logins persist on refreshing
  useEffect(() => {
    const savedSimulatedUser = localStorage.getItem('banalia3d_simulated_user');
    if (savedSimulatedUser) {
      try {
        const parsed = JSON.parse(savedSimulatedUser);
        setUser(parsed);
        setIsSimulated(true);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('banalia3d_simulated_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Prioritize active firebase session, unless we explicitly requested simulated maker earlier
      if (currentUser) {
        setUser(currentUser);
        setIsSimulated(false);
        setLoading(false);

        // Sync user details to users collection in Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          await setDoc(userDocRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            lastLogin: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error("Error syncing user data to firestore:", error);
        }
      } else {
        // Only clear if we are not currently in simulated mode
        const simulationActive = localStorage.getItem('banalia3d_simulated_user');
        if (!simulationActive) {
          setUser(null);
          setIsSimulated(false);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      // Remove any leftover simulation
      localStorage.removeItem('banalia3d_simulated_user');
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Google Sign-In failed:", error);
      
      const errorCode = error?.code || '';
      const errorMessage = error?.message || 'Google Auth Popup was closed or blocked.';
      
      // If unauthorized-domain error is returned
      if (errorCode === 'auth/unauthorized-domain' || errorMessage.includes('unauthorized-domain')) {
        setAuthError({
          code: 'unauthorized-domain',
          message: errorMessage,
          domains: [
            'ais-dev-7ochxmqjh52fc6igs67x6x-1017435557931.asia-southeast1.run.app',
            'ais-pre-7ochxmqjh52fc6igs67x6x-1017435557931.asia-southeast1.run.app'
          ]
        });
      } else {
        setAuthError({
          code: errorCode,
          message: errorMessage,
          domains: []
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginAnonymously = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      localStorage.removeItem('banalia3d_simulated_user');
      const credential = await signInAnonymously(auth);
      
      if (credential.user) {
        const guestUser: SimulatedUser = {
          uid: credential.user.uid,
          email: 'anonymous_maker@banalia3d.com',
          displayName: 'Anonymous Maker (Firebase Verified)',
          photoURL: null,
          isAnonymous: true
        };
        setUser(guestUser);
        setIsSimulated(false);
      }
    } catch (error: any) {
      console.error("Anonymous Sign-In failed:", error);
      // Fallback directly to simulated maker session if Anonymous is disabled in firebase console
      loginWithSimulatedMaker();
    } finally {
      setLoading(false);
    }
  };

  const loginWithSimulatedMaker = () => {
    setLoading(true);
    setAuthError(null);
    const guestUser: SimulatedUser = {
      uid: 'demo_developer_maker_2026',
      email: 'govindsingh2k26@gmail.com', // Set to user's real email from metadata
      displayName: 'Govind Singh (Simulated Mode)',
      photoURL: null,
      isSimulated: true
    };
    localStorage.setItem('banalia3d_simulated_user', JSON.stringify(guestUser));
    setUser(guestUser);
    setIsSimulated(true);
    setLoading(false);
  };

  const logout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('banalia3d_simulated_user');
      setUser(null);
      setIsSimulated(false);
      setAuthError(null);
      await signOut(auth);
    } catch (error) {
      console.error("Sign-Out failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isSimulated, 
      authError, 
      loginWithGoogle, 
      loginAnonymously,
      loginWithSimulatedMaker,
      logout,
      clearAuthError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
