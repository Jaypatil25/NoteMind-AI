

const getApiUrl = () => {

  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  return 'http://localhost:5001/api';
};

const API_BASE = getApiUrl();

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
