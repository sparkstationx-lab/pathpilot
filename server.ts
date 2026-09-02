import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  handleMatchOpportunity,
  handleGenerateApplication,
} from './api/_lib/agent';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Route: AI Opportunity Match Analysis
app.post('/api/match-opportunity', async (req, res) => {
  try {
    const result = await handleMatchOpportunity(req.body);
    res.json(result);
  } catch (err: any) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
  }
});

// API Route: AI Application Materials Generator (Resume Summary, Cover Letter, Application Email)
app.post('/api/generate-application', async (req, res) => {
  try {
    const result = await handleGenerateApplication(req.body);
    res.json(result);
  } catch (err: any) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Autonomous AI Career Agent API',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Autonomous AI Career Agent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
