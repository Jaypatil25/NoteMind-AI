import { useState, useEffect, useRef, useCallback } from 'react';

const EXAM_DURATION = 5 * 60;

export default function ExamMode({ data }) {
  const questions = data?.questions || [];
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!started || finished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [started, finished]);

  const handleFinish = useCallback(() => {
    clearInterval(timerRef.current);
    setFinished(true);
  }, []);

  if (questions.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-neutral-400 font-body">No MCQ data available for exam mode.</p>
      </div>
    );
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function getScore() {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selected[idx] === q.answer) correct++;
    });
    return correct;
  }

  if (!started) {
    return (
      <div className="glass-card p-10 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🎯</span>
        </div>
        <h3 className="font-display text-3xl text-text-primary mb-3">Exam Mode</h3>
        <p className="text-text-secondary font-body text-sm mb-2">
          {questions.length} questions · 5 minute time limit
        </p>
        <p className="text-neutral-400 font-body text-xs mb-8">
          Answer each question within the time limit. Your score will be shown at the end.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="bg-black hover:bg-neutral-800 text-white px-8 py-3 rounded-xl text-sm font-medium
                     font-body transition-all duration-300 hover:shadow-lg btn-press"
        >
          Start Exam
        </button>
      </div>
    );
  }

  if (finished) {
    const score = getScore();
    const percentage = Math.round((score / questions.length) * 100);
    const circumference = 2 * Math.PI * 45;
    const dashOffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-10 text-center mb-8">
          <h3 className="font-display text-3xl text-text-primary mb-6">Exam Complete!</h3>

          <div className="relative w-36 h-36 mx-auto mb-6">
            <svg width="144" height="144" viewBox="0 0 100 100" className="-rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E5E5" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke={percentage >= 80 ? '#10B981' : percentage >= 50 ? '#F59E0B' : '#EF4444'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ animation: 'scoreReveal 1.5s ease-out forwards' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-body text-text-primary">{percentage}%</span>
              <span className="text-xs text-neutral-400 font-body">{score}/{questions.length}</span>
            </div>
          </div>

          <p className="text-text-secondary font-body text-sm">
            {percentage >= 80 ? '🎉 Excellent work!' : percentage >= 50 ? '👍 Good effort! Keep studying.' : '📚 Keep practicing, you\'ll get there!'}
          </p>

          <div className="mt-4 text-xs text-neutral-400 font-body">
            Time used: {formatTime(EXAM_DURATION - timeLeft)}
          </div>
        </div>

        {/* Answer Review */}
        <div className="space-y-4">
          <h4 className="text-lg font-display text-text-primary mb-4">Answer Review</h4>
          {questions.map((q, idx) => {
            const userAnswer = selected[idx];
            const isCorrect = userAnswer === q.answer;

            return (
              <div key={idx} className="glass-card p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className={`flex-shrink-0 w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center font-body
                    ${isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <p className="text-text-primary font-body text-sm">{q.question}</p>
                </div>
                <div className="ml-10 space-y-1.5">
                  {userAnswer && !isCorrect && (
                    <p className="text-red-500 text-xs font-body">
                      Your answer: {userAnswer}
                    </p>
                  )}
                  <p className="text-emerald-600 text-xs font-body">
                    Correct: {q.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 font-body uppercase tracking-wider">
            Question {currentIdx + 1} of {questions.length}
          </span>
        </div>
        <div className={`text-xl font-body font-bold tabular-nums ${timeLeft <= 60 ? 'timer-warning' : 'text-text-primary'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="w-full h-1 bg-neutral-100 rounded-full mb-8">
        <div
          className="h-full bg-black rounded-full transition-all duration-500"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="glass-card p-8 mb-6">
        <p className="text-text-primary font-body text-lg leading-relaxed">
          {q.question}
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {q.options.map((option, oIdx) => (
          <button
            key={oIdx}
            onClick={() => setSelected((prev) => ({ ...prev, [currentIdx]: option }))}
            className={`w-full text-left px-5 py-4 rounded-xl text-sm font-body transition-all duration-300 border flex items-center gap-3
              ${selected[currentIdx] === option
                ? 'bg-neutral-100 border-neutral-300 text-text-primary'
                : 'bg-white border-neutral-200 hover:border-neutral-300 text-text-secondary hover:text-text-primary'
              }`}
          >
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
              ${selected[currentIdx] === option ? 'bg-black text-white' : 'bg-neutral-50 text-neutral-400'}`}>
              {optionLetters[oIdx]}
            </span>
            {option}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="px-5 py-2.5 rounded-xl text-sm font-body font-medium text-neutral-400
                     hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx((i) => i + 1)}
            className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl text-sm
                       font-medium font-body transition-all duration-300 btn-press"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm
                       font-medium font-body transition-all duration-300 btn-press"
          >
            Finish Exam
          </button>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300
              ${idx === currentIdx
                ? 'bg-black scale-125'
                : selected[idx]
                ? 'bg-neutral-400'
                : 'bg-neutral-200'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
