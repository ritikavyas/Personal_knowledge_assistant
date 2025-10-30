// Load environment variables FIRST before any other imports
import './config/env';
import express from 'express';
import cors from 'cors';
import { getPort, getFrontendUrl } from './config/env';
import documentsRouter from './routes/documents';
import chatRouter from './routes/chat';

const app = express();
const PORT = getPort();

// Middleware
app.use(cors({
  origin: getFrontendUrl(),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/documents', documentsRouter);
app.use('/api/chat', chatRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Personal Knowledge Assistant API is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`✅ Google Gemini API key loaded`);
  console.log(`📝 API endpoints:`);
  console.log(`   - POST   /api/documents/upload`);
  console.log(`   - GET    /api/documents`);
  console.log(`   - DELETE /api/documents/:id`);
  console.log(`   - POST   /api/chat`);
  console.log(`   - GET    /api/health\n`);
});

// Set timeout to 5 minutes for long-running operations (document processing)
server.timeout = 300000; // 5 minutes

export default app;
