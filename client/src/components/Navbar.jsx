import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase/config';
import AuthModal from './AuthModal';

export default function Navbar({ onStartLearning }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 80);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  const menuItems = [
    { label: 'Home' },
    { label: 'Reach Us' },
  ];

  function UserButton() {
    if (currentUser) {
      return (
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 px-4 py-2.5 rounded-full text-sm font-medium font-body transition-all duration-200"
          >
            <img
              src={currentUser.photoURL || 'https://via.placeholder.com/32'}
              alt={currentUser.displayName || 'User'}
              className="w-6 h-6 rounded-full"
            />
            <span className="hidden md:block">{currentUser.displayName?.split(' ')[0] || 'User'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-neutral-100">
                <p className="text-sm font-medium text-neutral-900">{currentUser.displayName}</p>
                <p className="text-xs text-neutral-500">{currentUser.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => setShowAuthModal(true)}
        className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium font-body
                   transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-black/10
                   btn-press"
      >
        Sign In
      </button>
    );
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-500
                    ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <a href="#" className="font-display text-3xl md:text-4xl text-black tracking-tight">
            NoteMind<sup className="text-xs align-super">®</sup>
          </a>

          <UserButton />

          <button
            className="md:hidden text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
                    ${isScrolled ? 'translate-y-4 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div
          className="mx-auto max-w-3xl flex items-center justify-between px-6 py-3 rounded-full
                     bg-white/70 backdrop-blur-xl border border-white/30
                     shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <a href="#" className="font-display text-2xl text-black tracking-tight">
            NoteMind<sup className="text-[10px] align-super">®</sup>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item, i) => (
              <a
                key={item.label}
                href="#"
                className={`text-sm font-body font-medium transition-colors duration-300 hover:text-black
                           ${i === 0 ? 'text-black' : 'text-black/50'}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            className="md:hidden text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mx-4 mt-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/30
                          shadow-[0_8px_32px_rgba(0,0,0,0.08)] px-6 py-5 animate-slide-up">
            {menuItems.map((item, i) => (
              <a
                key={item.label}
                href="#"
                className={`block py-2.5 text-sm font-body font-medium transition-colors duration-300 hover:text-black
                           ${i === 0 ? 'text-black' : 'text-black/50'}`}
              >
                {item.label}
              </a>
            ))}
            {currentUser ? (
              <div className="mt-3 pt-3 border-t border-neutral-200">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={currentUser.photoURL || 'https://via.placeholder.com/32'}
                    alt={currentUser.displayName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{currentUser.displayName}</p>
                    <p className="text-xs text-neutral-500">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-neutral-100 text-neutral-700 px-6 py-2.5 rounded-full text-sm font-medium font-body hover:bg-neutral-200 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="mt-3 w-full bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium font-body btn-press"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
