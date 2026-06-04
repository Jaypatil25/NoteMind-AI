import { useReducer, useEffect, useRef, useCallback } from 'react';

const EXAM_DURATION = 5 * 60;

const initialState = {
  started: false,
  currentIdx: 0,
  selected: {},
  timeLeft: EXAM_DURATION,
  finished: false,
};

function examReducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, started: true };
    case 'GO_TO_QUESTION':
      return { ...state, currentIdx: action.payload };
    case 'SELECT_ANSWER':
      return {
        ...state,
        selected: { ...state.selected, [state.currentIdx]: action.payload },
      };
    case 'TICK_TIMER':
      if (state.timeLeft <= 1) {
        return { ...state, timeLeft: 0, finished: true };
      }
      return { ...state, timeLeft: state.timeLeft - 1 };
    case 'FINISH':
      return { ...state, finished: true };
    default:
      return state;
  }
}

export default function ExamMode({ data }) {
  const questions = data?.questions || [];
  const [state, dispatch] = useReducer(examReducer, initialState);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!state.started || state.finished) return;

    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [state.started, state.finished]);

  const handleFinish = useCallback(() => {
    clearInterval(timerRef.current);
    dispatch({ type: 'FINISH' });
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



  if (!started) {
    return (
      <div className="glass-card p-10 text-center max-w-lg mx-auto">
        <div className="size-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-700">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
        <h3 className="font-display text-3xl text-text-primary mb-3">Exam Mode</h3>
        <p className="text-text-secondary font-body text-sm mb-2">
          {questions.length} questions · 5 minute time limit
        </p>
        <p className="text-neutral-400 font-body text-xs mb-8">
          Answer each question within the time limit. Your score will be shown at the end.
        </p>
        <button
          onClick={() => dispatch({ type: 'START' })}
          className="bg-gray-950 hover:bg-neutral-800 text-white px-8 py-3 rounded-xl text-sm font-medium
                     font-body transition-all duration-300 hover:shadow-lg btn-press"
        >
          Start Exam
        </button>
      </div>
    );
  }

  if (finished) {
    const getScore = () => {
      let correct = 0;
      questions.forEach((q, idx) => {
        if (state.selected[idx] === q.answer) correct++;
      });
      return correct;
    };
    const score = getScore();
    const percentage = Math.round((score / questions.length) * 100);
    const circumference = 2 * Math.PI * 45;
    const dashOffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-10 text-center mb-8">
          <h3 className="font-display text-3xl text-text-primary mb-6">Exam Complete!</h3>

          <div className="relative size-36 mx-auto mb-6">
            <svg width="144" height="144" viewBox="0 0 100 100" className="-rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E5E5" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke={percentage >= 80 ? '#10B981' : percentage >= 50 ? '#F59E0B' : '#EF4444'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ animation: 'scoreReveal 1s ease-out forwards' }}
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
            Time used: {formatTime(EXAM_DURATION - state.timeLeft)}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-display text-text-primary mb-4">Answer Review</h4>
          {questions.map((q, idx) => {
            const userAnswer = selected[idx];
            const isCorrect = userAnswer === q.answer;

            return (
              <div key={q.question} className="glass-card p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className={`flex-shrink-0 size-7 rounded-lg flex items-center justify-center font-body
                    ${isCorrect ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    {isCorrect ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-red-600">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
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

  const q = questions[state.currentIdx];
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 font-body uppercase tracking-wider">
            Question {state.currentIdx + 1} of {questions.length}
          </span>
        </div>
        <div className={`text-xl font-body font-bold tabular-nums ${state.timeLeft <= 60 ? 'timer-warning' : 'text-text-primary'}`}>
          {formatTime(state.timeLeft)}
        </div>
      </div>

      <div className="w-full h-1 bg-neutral-100 rounded-full mb-8">
        <div
          className="h-full bg-gray-950 rounded-full transition-all duration-500"
          style={{ width: `${((state.currentIdx + 1) / questions.length) * 100}%` }}
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
            key={option}
            onClick={() => dispatch({ type: 'SELECT_ANSWER', payload: option })}
            className={`w-full text-left px-5 py-4 rounded-xl text-sm font-body transition-all duration-300 border flex items-center gap-3
              ${state.selected[state.currentIdx] === option
                ? 'bg-neutral-100 border-neutral-300 text-text-primary'
                : 'bg-white border-neutral-200 hover:border-neutral-300 text-text-secondary hover:text-text-primary'
              }`}
          >
            <span className={`size-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
              ${state.selected[state.currentIdx] === option ? 'bg-gray-950 text-white' : 'bg-neutral-50 text-neutral-400'}`}>
              {optionLetters[oIdx]}
            </span>
            {option}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: 'GO_TO_QUESTION', payload: Math.max(0, state.currentIdx - 1) })}
          disabled={state.currentIdx === 0}
          className="px-5 py-2.5 rounded-xl text-sm font-body font-medium text-neutral-400
                     hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {state.currentIdx < questions.length - 1 ? (
          <button
            onClick={() => dispatch({ type: 'GO_TO_QUESTION', payload: state.currentIdx + 1 })}
            className="bg-gray-950 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl text-sm
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
        {questions.map((q, idx) => (
          <button
            key={q.question}
            onClick={() => dispatch({ type: 'GO_TO_QUESTION', payload: idx })}
            className={`size-2.5 rounded-full transition-all duration-300
              ${idx === state.currentIdx
                ? 'bg-gray-950 scale-125'
                : state.selected[idx]
                ? 'bg-neutral-400'
                : 'bg-neutral-200'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
