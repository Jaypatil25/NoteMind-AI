import { createContext, use, useEffect, useReducer } from 'react';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
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
    const initAuth = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          dispatch({ type: 'SET_USER', payload: result.user });
        }
      } catch (error) {
        console.error('Error getting redirect result:', error);
      }

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        dispatch({ type: 'SET_USER', payload: user });
      });

      return unsubscribe;
    };

    let unsubscribe;
    initAuth().then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, loading: state.loading }}>
      {!state.loading && children}
    </AuthContext.Provider>
  );
}