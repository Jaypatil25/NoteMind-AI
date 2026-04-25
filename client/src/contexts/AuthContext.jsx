import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    // Handle redirect result from OAuth redirect flow
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setCurrentUser(result.user);
        }
      })
      .catch((error) => {
        // Log actual errors, ignore user cancellations
        if (error.code !== 'auth/popup-closed-by-user') {
          console.error('Redirect result error:', error);
        }
      });

    // Listen for auth state changes
    unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}