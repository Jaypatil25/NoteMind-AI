import { useState, useMemo } from 'react';

export default function McqTab({ data }) {
  const questions = data?.questions || [];
  const [revealed, setRevealed] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const randomizedQuestions = useMemo(() => {
    return questions.map((q) => {
      const optionIndices = [0, 1, 2, 3];
      for (let i = optionIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionIndices[i], optionIndices[j]] = [optionIndices[j], optionIndices[i]];
      }
      return {
        ...q,
        shuffledOptions: optionIndices.map((i) => q.options[i]),
      };
    });
  }, [questions]);

  if (questions.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-neutral-400 font-body">No MCQ data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {randomizedQuestions.map((q, idx) => (
        <div key={idx} className="glass-card glass-card-hover p-6">
          <div className="flex gap-3 mb-5">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-100 text-text-primary text-sm font-bold
                            flex items-center justify-center font-body">
              {idx + 1}
            </span>
            <p className="text-text-primary font-body text-sm leading-relaxed pt-1">
              {q.question}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-11">
            {q.shuffledOptions.map((option, oIdx) => {
              const isCorrect = option === q.answer;
              const isSelected = selectedAnswers[idx] === oIdx;
              const isRevealed = revealed[idx];
              const optionLetters = ['A', 'B', 'C', 'D'];

              let bgClass = 'bg-neutral-50 border-neutral-200 hover:border-neutral-300 text-text-secondary hover:text-text-primary';
              if (isRevealed) {
                if (isCorrect) {
                  bgClass = 'bg-emerald-50 border-emerald-200 text-emerald-700';
                } else if (isSelected) {
                  bgClass = 'bg-red-50 border-red-200 text-red-700';
                } else {
                  bgClass = 'bg-neutral-50 border-neutral-200 text-neutral-400';
                }
              } else if (isSelected) {
                bgClass = 'bg-blue-50 border-blue-200 text-blue-700';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => {
                    setSelectedAnswers((prev) => ({ ...prev, [idx]: oIdx }));
                    if (!revealed[idx]) {
                      setRevealed((prev) => ({ ...prev, [idx]: true }));
                    }
                  }}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-body transition-all duration-300 border
                    ${bgClass}`}
                >
                  <span className={`inline-block w-6 font-medium ${
                    isRevealed && isCorrect ? 'text-emerald-600' : isRevealed && isSelected && !isCorrect ? 'text-red-600' : 'text-neutral-400'
                  }`}>
                    {optionLetters[oIdx]}.
                  </span>
                  {option}
                  {isRevealed && isCorrect && (
                    <span className="ml-2 text-emerald-600">✓</span>
                  )}
                  {isRevealed && isSelected && !isCorrect && (
                    <span className="ml-2 text-red-600">✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {!revealed[idx] && (
            <div className="mt-4 ml-11">
              <button
                onClick={() => setRevealed((prev) => ({ ...prev, [idx]: true }))}
                className="text-xs text-neutral-400 hover:text-text-primary font-body transition-colors"
              >
                Reveal answer
              </button>
            </div>
          )}
          {revealed[idx] && (
            <div className="mt-4 ml-11">
              <button
                onClick={() => {
                  setRevealed((prev) => ({ ...prev, [idx]: false }));
                  setSelectedAnswers((prev) => ({ ...prev, [idx]: undefined }));
                }}
                className="text-xs text-neutral-400 hover:text-text-primary font-body transition-colors"
              >
                Reset answer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
