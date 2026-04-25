import { useState, useRef } from 'react';
import { uploadPDF } from '../utils/api';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const CATEGORIES = ['General', 'Science', 'Mathematics', 'History', 'Programming', 'Literature', 'Business'];

export default function NotesInput({ onGenerate, isLoading }) {
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [category, setCategory] = useState('General');
  const [isDragging, setIsDragging] = useState(false);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const fileInputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!notes.trim() || isLoading) return;
    onGenerate(notes, difficulty, category);
  }

  async function handlePDF(file) {
    if (!file || file.type !== 'application/pdf') {
      setPdfError('Please upload a PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPdfError('PDF must be under 10MB.');
      return;
    }

    setPdfError(null);
    setPdfLoading(true);
    try {
      const result = await uploadPDF(file);
      setNotes(result.text);
      setPdfInfo({ filename: result.filename, pages: result.pages });
    } catch (err) {
      setPdfError(err.message);
    } finally {
      setPdfLoading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handlePDF(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) handlePDF(file);
    e.target.value = '';
  }

  function clearPdf() {
    setPdfInfo(null);
    setNotes('');
    setPdfError(null);
  }

  return (
    <section id="workspace" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-neutral-400 text-sm font-medium font-body tracking-widest uppercase">
            Workspace
          </span>
          <h2 className="font-display text-4xl md:text-6xl mt-3 text-text-black-500">
            Paste your notes
          </h2>
          <p className="mt-4 text-text-secondary font-body max-w-lg mx-auto">
            Drop in your raw notes or upload a PDF and let AI transform them into structured learning material.
          </p>
        </div>

        <form onSubmit={handleSubmit} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
          <div
            className={`rounded-2xl border bg-white shadow-sm
                       transition-all duration-300 focus-within:shadow-md focus-within:border-neutral-300
                       ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-neutral-200'}`}
          >
            <textarea
              id="notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your notes here... lectures, textbook excerpts, study material"
              className="w-full min-h-[200px] bg-transparent text-text-primary font-body text-sm leading-relaxed
                         p-5 pb-3 resize-none outline-none placeholder:text-neutral-400 rounded-t-2xl"
              disabled={isLoading}
            />

            <div className="px-4 pb-4 pt-1 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {pdfLoading ? (
                    <div className="flex items-center gap-2 text-neutral-400">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="text-xs font-body">Extracting PDF...</span>
                    </div>
                  ) : pdfInfo ? (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                      </svg>
                      <span className="text-xs font-body truncate">
                        {pdfInfo.filename} — {pdfInfo.pages} page{pdfInfo.pages !== 1 ? 's' : ''}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); clearPdf(); }}
                        className="text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-600 transition-colors"
                      disabled={pdfLoading}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <polyline points="9,15 12,12 15,15" />
                      </svg>
                      <span className="text-xs font-body">Upload PDF</span>
                    </button>
                  )}

                  <span className="text-[11px] text-neutral-300 font-body tabular-nums ml-auto flex-shrink-0">
                    {notes.length.toLocaleString()} chars
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <select
                    id="difficulty-select"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="appearance-none bg-neutral-50 border border-neutral-200 text-text-primary text-xs font-body
                               pl-3 pr-7 py-2 rounded-lg outline-none cursor-pointer
                               transition-colors hover:border-neutral-300 focus:border-neutral-400"
                    disabled={isLoading}
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </div>

                <div className="relative">
                  <select
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none bg-neutral-50 border border-neutral-200 text-text-primary text-xs font-body
                               pl-3 pr-7 py-2 rounded-lg outline-none cursor-pointer
                               transition-colors hover:border-neutral-300 focus:border-neutral-400"
                    disabled={isLoading}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </div>

                <div className="flex-1" />

                <button
                  id="generate-button"
                  type="submit"
                  disabled={isLoading || !notes.trim()}
                  className="bg-black text-white px-5 py-2 rounded-lg text-xs font-medium font-body
                             transition-all duration-200 hover:bg-neutral-800
                             disabled:opacity-30 disabled:cursor-not-allowed
                             btn-press flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {pdfError && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-red-500 text-sm">⚠</span>
              <span className="text-red-600 font-body text-xs">{pdfError}</span>
              <button
                type="button"
                onClick={() => setPdfError(null)}
                className="ml-auto text-red-300 hover:text-red-500 text-sm"
              >
                ×
              </button>
            </div>
          )}

          {isDragging && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className="fixed inset-0 z-50 bg-black/5 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="bg-white rounded-2xl border-2 border-dashed border-neutral-300 px-12 py-10 text-center shadow-xl">
                <p className="text-text-primary font-body font-medium">Drop your PDF here</p>
                <p className="text-neutral-400 font-body text-xs mt-1">Max 10MB · Text-based PDFs only</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
