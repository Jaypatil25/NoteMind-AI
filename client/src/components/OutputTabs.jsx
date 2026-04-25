import { useState } from 'react';
import SummaryTab from './SummaryTab';
import McqTab from './McqTab';
import FlashcardTab from './FlashcardTab';
import ExamMode from './ExamMode';

const TABS = [
  {
    id: 'summary',
    label: 'Summary',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="13" x2="8" y2="13" />
        <line x1="12" y1="17" x2="8" y2="17" />
        <line x1="16" y1="13" x2="16" y2="17" />
      </svg>
    ),
  },
  {
    id: 'mcqs',
    label: 'MCQs',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="1" />
        <path d="M12 8v8M8 12h8M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
      </svg>
    ),
  },
  {
    id: 'flashcards',
    label: 'Flashcards',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="12" rx="2" />
        <path d="M4 16h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="14" y2="13" />
      </svg>
    ),
  },
  {
    id: 'exam',
    label: 'Exam Mode',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
];

export default function OutputTabs({ data }) {
  const [activeTab, setActiveTab] = useState('summary');

  if (!data) return null;

  function renderTab() {
    switch (activeTab) {
      case 'summary':
        return <SummaryTab data={data.summary} />;
      case 'mcqs':
        return <McqTab data={data.mcqs} />;
      case 'flashcards':
        return <FlashcardTab data={data.flashcards} />;
      case 'exam':
        return <ExamMode data={data.mcqs} />;
      default:
        return null;
    }
  }

  return (
    <section id="output" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-neutral-400 text-sm font-medium font-body tracking-widest uppercase">
            Results
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 text-text-primary">
            Your learning material
          </h2>
        </div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-neutral-50 rounded-2xl p-1.5 border border-neutral-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-300 flex items-center gap-2
                  ${activeTab === tab.id
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-400 hover:text-text-primary'
                  }`}
              >
                <span className="flex-shrink-0 w-4 h-4">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="animate-slide-up">
          {renderTab()}
        </div>
      </div>
    </section>
  );
}
