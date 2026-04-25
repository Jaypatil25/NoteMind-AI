const API_BASE = '/api';

/**
 * Generate summary, MCQs, and flashcards from notes.
 * @param {string} notes - The raw notes text
 * @param {string} difficulty - Easy | Medium | Hard
 * @param {string} category - Subject category
 * @returns {Promise<{summary: object, mcqs: object, flashcards: object}>}
 */
export async function generateContent(notes, difficulty, category) {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes, difficulty, category }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Failed to generate content');
  }

  return response.json();
}

/**
 * Upload a PDF and extract its text content.
 * @param {File} file - The PDF file
 * @returns {Promise<{text: string, pages: number, filename: string}>}
 */
export async function uploadPDF(file) {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || 'Failed to upload PDF');
  }

  return response.json();
}
