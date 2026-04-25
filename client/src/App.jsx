import { useState, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NotesInput from './components/NotesInput';
import OutputTabs from './components/OutputTabs';
import Footer from './components/Footer';
import { generateContent } from './utils/api';

export default function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const studioRef = useRef(null);
  const outputRef = useRef(null);

  const scrollToStudio = useCallback(() => {
    studioRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  async function handleGenerate(notes, difficulty, category) {
    setError(null);
    setIsLoading(true);
    try {
      const data = await generateContent(notes, difficulty, category);
      setResults(data);
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onStartLearning={scrollToStudio} />
      <Hero onStartLearning={scrollToStudio} />

      <div ref={studioRef}>
        <NotesInput onGenerate={handleGenerate} isLoading={isLoading} />
      </div>

      {error && (
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-start gap-3">
            <span className="text-danger text-lg flex-shrink-0">⚠</span>
            <div>
              <p className="text-danger font-body text-sm font-medium">Generation Failed</p>
              <p className="text-danger/70 font-body text-xs mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-danger/50 hover:text-danger transition-colors text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 glass-card px-6 py-3">
              <svg className="animate-spin h-5 w-5 text-neutral-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-text-secondary font-body text-sm">AI is analyzing your notes...</span>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shimmer-loading h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      <div ref={outputRef}>
        {results && !isLoading && <OutputTabs data={results} />}
      </div>

      <Footer />
    </div>
  );
}
