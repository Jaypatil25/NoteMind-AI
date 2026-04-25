import { useState } from 'react';

export default function McqTab({ data }) {
  const questions = data?.questions || [];
  const [revealed, setRevealed] = useState({});

  if (questions.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-neutral-400 font-body">No MCQ data available.</p>
      </div>
    );
  }

  function toggleReveal(idx) {
    setRevealed((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  return (
    <div className="space-y-6">
      {questions.map((q, idx) => (
        <div key={idx} className="glass-card glass-card-hover p-6">
          {/* Question Number & Text */}
          <div className="flex gap-3 mb-5">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-100 text-text-primary text-sm font-bold
                            flex items-center justify-center font-body">
              {idx + 1}
            </span>
            <p className="text-text-primary font-body text-sm leading-relaxed pt-1">
              {q.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-11">
            {q.options.map((option, oIdx) => {
              const isCorrect = option === q.answer;
              const isRevealed = revealed[idx];
              const optionLetters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={oIdx}
                  onClick={() => toggleReveal(idx)}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-body transition-all duration-300 border
                    ${isRevealed && isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : isRevealed && !isCorrect
                      ? 'bg-neutral-50 border-neutral-200 text-neutral-400'
                      : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300 text-text-secondary hover:text-text-primary'
                    }`}
                >
                  <span className={`inline-block w-6 font-medium ${isRevealed && isCorrect ? 'text-emerald-600' : 'text-neutral-400'}`}>
                    {optionLetters[oIdx]}.
                  </span>
                  {option}
                  {isRevealed && isCorrect && (
                    <span className="ml-2 text-emerald-600">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Reveal toggle */}
          <div className="mt-4 ml-11">
            <button
              onClick={() => toggleReveal(idx)}
              className="text-xs text-neutral-400 hover:text-text-primary font-body transition-colors"
            >
              {revealed[idx] ? 'Hide answer' : 'Reveal answer'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
