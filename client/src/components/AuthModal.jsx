import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth } from '../firebase/config';

const ERROR_MESSAGES = {
  'auth/popup-blocked': 'Popup was blocked. Redirecting you to sign in...',
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/cancelled-popup-request': null,
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
};

export default function AuthModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleGoogleSignIn() {
    setLoading(true);
    setError('');

    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err) {
      const code = err.code;

      if (code === 'auth/popup-blocked') {
        setError(ERROR_MESSAGES['auth/popup-blocked']);
        try {
          await signInWithRedirect(auth, provider);
        } catch {
          setError('Sign-in failed. Please try again.');
          setLoading(false);
        }
        return;
      }

      const message = ERROR_MESSAGES[code];
      if (message !== null) {
        setError(message ?? 'Sign-in failed. Please try again.');
      }
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-display font-semibold">
            Sign In to Continue
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-center mb-8">
          <p className="text-neutral-600 font-body">
            Sign in with your Google account to upload PDFs and generate AI content.
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border-2 border-neutral-200 text-neutral-700 py-4 rounded-full font-medium hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-500 font-body">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}