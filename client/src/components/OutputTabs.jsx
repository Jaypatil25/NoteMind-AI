import { useState } from 'react';
import SummaryTab from './SummaryTab';
import McqTab from './McqTab';
import FlashcardTab from './FlashcardTab';
import ExamMode from './ExamMode';

const TABS = [
  { id: 'summary', label: 'Summary', icon: '📝' },
  { id: 'mcqs', label: 'MCQs', icon: '❓' },
  { id: 'flashcards', label: 'Flashcards', icon: '🃏' },
  { id: 'exam', label: 'Exam Mode', icon: '🎯' },
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
                className={`px-5 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-400 hover:text-text-primary'
                  }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
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
