import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import generateRoute from './routes/generate.js';
import uploadRoute from './routes/upload.js';

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/generate', generateRoute);
app.use('/api/upload', uploadRoute);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`✨ NoteMind server running on http://localhost:${PORT}`);
});
