import { useState, useEffect } from 'react';

export default function Navbar({ onStartLearning }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 80);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home' },
    { label: 'Studio' },
    { label: 'About' },
    { label: 'Journal' },
    { label: 'Reach Us' },
  ];

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

          <button
            onClick={onStartLearning}
            className="hidden md:block bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium font-body
                       transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-black/10
                       btn-press"
          >
            Start Learning
          </button>

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
            onClick={onStartLearning}
            className="hidden md:block bg-black text-white px-5 py-2 rounded-full text-sm font-medium font-body
                       transition-all duration-300 hover:scale-[1.03] hover:shadow-lg
                       btn-press"
          >
            Start Learning
          </button>

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
            <button
              onClick={onStartLearning}
              className="mt-3 w-full bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium font-body btn-press"
            >
              Start Learning
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
