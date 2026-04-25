import { Router } from 'express';
import multer from 'multer';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'));
    }
  },
});

/**
 * Extract all text from a PDF buffer using pdfjs-dist.
 */
async function extractTextFromPDF(buffer) {
  const uint8Array = new Uint8Array(buffer);
  const doc = await getDocument({ data: uint8Array, useSystemFonts: true }).promise;
  const numPages = doc.numPages;
  const textParts = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    textParts.push(pageText);
  }

  return { text: textParts.join('\n\n'), numPages };
}

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    const { text, numPages } = await extractTextFromPDF(req.file.buffer);

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Could not extract text from PDF. It may be scanned/image-based.' });
    }

    return res.json({
      text: text.trim(),
      pages: numPages,
      filename: req.file.originalname,
    });
  } catch (err) {
    console.error('PDF parse error:', err);
    return res.status(500).json({ error: 'Failed to parse PDF.' });
  }
});

export default router;
