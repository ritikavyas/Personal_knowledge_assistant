// Load environment variables FIRST before any other imports
import './config/env';
import express from 'express';
import cors from 'cors';
import { getPort, getFrontendUrl } from './config/env';
import documentsRouter from './routes/documents';
import chatRouter from './routes/chat';

const app = express();
const PORT = getPort();

// CORS Configuration - Allow multiple origins
const allowedOrigins = [
  getFrontendUrl(),
  'http://localhost:5173',
  'http://localhost:3000',
  // Add your Vercel deployment URL here when deployed
  // 'https://your-app.vercel.app',
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed list or matches Vercel preview deployments
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
