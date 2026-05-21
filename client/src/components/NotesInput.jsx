import { useReducer, useRef } from 'react';
import { uploadPDF } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const initialState = {
  notes: '',
  isDragging: false,
  pdfInfo: null,
  pdfLoading: false,
  pdfError: null,
  showAuthModal: false,
};

function notesReducer(state, action) {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_DRAGGING':
      return { ...state, isDragging: action.payload };
    case 'SET_PDF_INFO':
      return { ...state, pdfInfo: action.payload };
    case 'SET_PDF_LOADING':
      return { ...state, pdfLoading: action.payload };
    case 'SET_PDF_ERROR':
      return { ...state, pdfError: action.payload };
    case 'SET_SHOW_AUTH_MODAL':
      return { ...state, showAuthModal: action.payload };
    case 'RESET_PDF':
      return { ...state, pdfInfo: null, notes: '', pdfError: null };
    default:
      return state;
  }
}

export default function NotesInput({ onGenerate, isLoading }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const fileInputRef = useRef(null);
  const { currentUser } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();
    if (!state.notes.trim() || isLoading) return;
    
    if (!currentUser) {
      dispatch({ type: 'SET_SHOW_AUTH_MODAL', payload: true });
      return;
    }
    
    onGenerate(state.notes);
  }

  async function handlePDF(file) {
    if (!currentUser) {
      dispatch({ type: 'SET_SHOW_AUTH_MODAL', payload: true });
      return;
    }
    
    if (!file || file.type !== 'application/pdf') {
      dispatch({ type: 'SET_PDF_ERROR', payload: 'Please upload a PDF file.' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      dispatch({ type: 'SET_PDF_ERROR', payload: 'PDF must be under 10MB.' });
      return;
    }

    dispatch({ type: 'SET_PDF_ERROR', payload: null });
    dispatch({ type: 'SET_PDF_LOADING', payload: true });
    try {
      const result = await uploadPDF(file);
      dispatch({ type: 'SET_NOTES', payload: result.text });
      dispatch({ type: 'SET_PDF_INFO', payload: { filename: result.filename, pages: result.pages } });
    } catch (err) {
      dispatch({ type: 'SET_PDF_ERROR', payload: err.message });
    } finally {
      dispatch({ type: 'SET_PDF_LOADING', payload: false });
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    dispatch({ type: 'SET_DRAGGING', payload: false });
    const file = e.dataTransfer.files[0];
    handlePDF(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    dispatch({ type: 'SET_DRAGGING', payload: true });
  }

  function handleDragLeave(e) {
    e.preventDefault();
    dispatch({ type: 'SET_DRAGGING', payload: false });
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) handlePDF(file);
    e.target.value = '';
  }

  function clearPdf() {
    dispatch({ type: 'RESET_PDF' });
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
                       ${state.isDragging ? 'border-blue-400 bg-blue-50' : 'border-neutral-200'}`}
          >
            <textarea
              id="notes-input"
              value={state.notes}
              onChange={(e) => dispatch({ type: 'SET_NOTES', payload: e.target.value })}
              placeholder="Paste your notes here... lectures, textbook excerpts, study material"
              className="w-full min-h-[200px] bg-transparent text-text-primary font-body text-sm leading-relaxed
                         p-5 pb-3 resize-none outline-none placeholder:text-neutral-400 rounded-t-2xl"
              disabled={isLoading}
            />

            <div className="px-4 pb-4 pt-1 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-neutral-300 font-body tabular-nums">
                  {state.notes.length.toLocaleString()} chars
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {state.pdfLoading ? (
                    <div className="flex items-center gap-2 text-neutral-400">
                      <svg className="animate-spin size-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="text-sm font-body">Extracting PDF…</span>
                    </div>
                  ) : state.pdfInfo ? (
                    <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-full border border-emerald-200">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                      </svg>
                      <span className="text-sm font-body truncate max-w-[200px]" title={state.pdfInfo.filename}>
                        {state.pdfInfo.filename}: {state.pdfInfo.pages} page{state.pdfInfo.pages !== 1 ? 's' : ''}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); clearPdf(); }}
                        className="text-emerald-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2.5 text-neutral-600 hover:text-neutral-800 transition-colors
                                 bg-neutral-50 hover:bg-neutral-100 px-6 py-3 rounded-full border border-neutral-200
                                 hover:border-neutral-300 shadow-sm hover:shadow-md"
                      disabled={state.pdfLoading}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <polyline points="9,15 12,12 15,15" />
                      </svg>
                      <span className="text-sm font-body font-medium">Upload PDF</span>
                    </button>
                  )}
                </div>

                <button
                  id="generate-button"
                  type="submit"
                  disabled={isLoading || !state.notes.trim()}
                  className="bg-gray-950 text-white px-8 py-3.5 rounded-full text-sm font-medium font-body
                             transition-all duration-200 hover:bg-neutral-800 hover:scale-[1.02]
                             disabled:opacity-30 disabled:cursor-not-allowed
                             btn-press flex items-center gap-2 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin size-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generating…
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {state.pdfError && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-red-500 text-sm">⚠</span>
              <span className="text-red-600 font-body text-xs">{state.pdfError}</span>
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_PDF_ERROR', payload: null })}
                className="ml-auto text-red-300 hover:text-red-500 text-sm"
              >
                ×
              </button>
            </div>
          )}

          {state.isDragging && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className="fixed inset-0 z-50 bg-gray-950/5 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="bg-white rounded-2xl border-2 border-dashed border-neutral-300 px-12 py-10 text-center shadow-xl">
                <p className="text-text-primary font-body font-medium">Drop your PDF here</p>
                <p className="text-neutral-400 font-body text-xs mt-1">Max 10MB · Text-based PDFs only</p>
              </div>
            </div>
          )}

          <AuthModal 
            isOpen={state.showAuthModal} 
            onClose={() => dispatch({ type: 'SET_SHOW_AUTH_MODAL', payload: false })}
          />
        </form>
      </div>
    </section>
  );
}
