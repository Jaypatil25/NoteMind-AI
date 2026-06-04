import { createContext, use, useEffect, useReducer } from 'react';
import { onAuthStateChanged, getRedirectResult, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return use(AuthContext);
}

const initialState = {
  currentUser: null,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { currentUser: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Set persistence to localStorage to maintain auth across page reloads
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error('Error setting persistence:', error);
      }

      try {
        // Handle redirect result from OAuth redirect flow
        const result = await getRedirectResult(auth);
        if (mounted && result?.user) {
          dispatch({ type: 'SET_USER', payload: result.user });
          return;
        }
      } catch (error) {
        console.error('Error getting redirect result:', error);
      }

      // Set up listener for auth state changes
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (mounted) {
          dispatch({ type: 'SET_USER', payload: user });
        }
      });

      return unsubscribe;
    };

    let unsubscribe;
    initAuth().then(unsub => {
      if (typeof unsub === 'function') {
        unsubscribe = unsub;
      }
    }).catch(error => {
      console.error('Error initializing auth:', error);
      if (mounted) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    });

    return () => {
      mounted = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, loading: state.loading }}>
      {!state.loading && children}
    </AuthContext.Provider>
  );
}