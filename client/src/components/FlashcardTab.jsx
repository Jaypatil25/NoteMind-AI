import { useState } from 'react';

export default function FlashcardTab({ data }) {
  const cards = data?.cards || [];
  const [flippedCards, setFlippedCards] = useState({});

  if (cards.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-neutral-400 font-body">No flashcard data available.</p>
      </div>
    );
  }

  function toggleFlip(idx) {
    setFlippedCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="flashcard-container cursor-pointer"
          onClick={() => toggleFlip(idx)}
          style={{ minHeight: '220px' }}
        >
          <div className={`flashcard-inner w-full h-full ${flippedCards[idx] ? 'flipped' : ''}`}
               style={{ minHeight: '220px' }}>
            <div className="flashcard-front glass-card p-6 flex flex-col justify-between h-full"
                 style={{ minHeight: '220px' }}>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-lg bg-neutral-100 text-text-primary text-xs font-bold
                                  flex items-center justify-center font-body">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-neutral-400 font-body uppercase tracking-wider">Question</span>
                </div>
                <p className="text-text-primary font-body text-sm leading-relaxed">
                  {card.question}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-neutral-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 014-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 01-4 4H3" />
                </svg>
                <span className="text-xs font-body">Click to flip</span>
              </div>
            </div>

            <div className="flashcard-back glass-card p-6 flex flex-col justify-between h-full"
                 style={{
                   minHeight: '220px',
                   background: 'linear-gradient(135deg, rgba(0,0,0,0.02), rgba(255,255,255,0.95))',
                   borderColor: 'rgba(0,0,0,0.08)',
                 }}>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold
                                  flex items-center justify-center font-body">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600 inline-block">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-xs text-emerald-600 font-body uppercase tracking-wider">Answer</span>
                </div>
                <p className="text-text-primary font-body text-sm leading-relaxed">
                  {card.answer}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-neutral-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 014-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 01-4 4H3" />
                </svg>
                <span className="text-xs font-body">Click to flip back</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
