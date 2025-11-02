import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import '../backend/src/config/env'; // Load environment variables
import chatRoutes from '../backend/src/routes/chat';
import documentRoutes from '../backend/src/routes/documents';
import { getAllowedOrigins, getNodeEnv } from '../backend/src/config/env';

const app = express();

// Request logging middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Security headers middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (getNodeEnv() === 'production') {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
  next();
});

// CORS Configuration
const allowedOrigins = getAllowedOrigins();
app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.netlify.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount routes
app.use('/api/chat', chatRoutes);
app.use('/api/documents', documentRoutes);

// Health check endpoint
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Personal Knowledge Assistant API is running',
    timestamp: new Date().toISOString(),
    platform: 'vercel',
  });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.url,
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Unhandled error:`, {
      message: err.message,
      stack: getNodeEnv() === 'development' ? err.stack : undefined,
      path: req.path,
      method: req.method,
    });
    
    const errorMessage = getNodeEnv() === 'production' 
      ? 'Internal server error' 
      : err.message || 'Internal server error';
    
    res.status(err.status || 500).json({
      error: errorMessage,
      ...(getNodeEnv() === 'development' && { stack: err.stack }),
    });
  }
);

// Export the Express app as a serverless function
export default async (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
