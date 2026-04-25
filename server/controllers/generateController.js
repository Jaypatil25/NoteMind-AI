import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

/**
 * Generate summary, MCQs, and flashcards from notes.
 */
export async function handleGenerate(req, res) {
  try {
    const { notes, difficulty = 'Medium', category = 'General' } = req.body;

    if (!notes || notes.trim().length === 0) {
      return res.status(400).json({ error: 'Notes content is required.' });
    }

    const context = `Difficulty: ${difficulty}. Category: ${category}.`;

    // Run all three Groq calls in parallel
    const [summaryResult, mcqsResult, flashcardsResult] = await Promise.all([
      generateSummary(notes, context),
      generateMCQs(notes, context),
      generateFlashcards(notes, context),
    ]);

    return res.json({
      summary: summaryResult,
      mcqs: mcqsResult,
      flashcards: flashcardsResult,
    });
  } catch (err) {
    console.error('Generation error:', err);
    return res.status(500).json({
      error: 'Failed to generate content. Please try again.',
      details: err.message,
    });
  }
}

// ─── Helpers ──────────────────────────────────────────

async function generateSummary(notes, context) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert educator. Summarize the provided notes into clear, structured bullet points. Return ONLY a JSON object with a "points" array of strings. No markdown, no code fences.',
      },
      {
        role: 'user',
        content: `${context}\n\nSummarize into structured bullet points:\n\n${notes}`,
      },
    ],
    temperature: 0.4,
    max_tokens: 2048,
  });

  const text = response.choices[0].message.content.trim();
  try {
    return JSON.parse(text);
  } catch {
    // Attempt to extract JSON from the response
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return { points: [text] };
  }
}

async function generateMCQs(notes, context) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert quiz creator. Generate exactly 5 multiple-choice questions from the notes. Return ONLY a JSON object with a "questions" array. Each object must have: "question" (string), "options" (array of 4 strings), "answer" (string matching one option exactly). No markdown, no code fences.',
      },
      {
        role: 'user',
        content: `${context}\n\nGenerate 5 MCQs with 4 options and correct answer:\n\n${notes}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 2048,
  });

  const text = response.choices[0].message.content.trim();
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return { questions: [] };
  }
}

async function generateFlashcards(notes, context) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert educator. Create exactly 5 flashcards from the notes. Return ONLY a JSON object with a "cards" array. Each object must have: "question" (string), "answer" (string). No markdown, no code fences.',
      },
      {
        role: 'user',
        content: `${context}\n\nCreate 5 flashcards (Q/A):\n\n${notes}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 2048,
  });

  const text = response.choices[0].message.content.trim();
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return { cards: [] };
  }
}
