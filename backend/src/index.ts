// Load environment variables FIRST before any other imports
import "./config/env";
import express from "express";
import cors from "cors";
import { getPort, getFrontendUrl, getNodeEnv, getAllowedOrigins } from "./config/env";
import documentsRouter from "./routes/documents";
import chatRouter from "./routes/chat";

const app = express();
const PORT = getPort();

const allowedOrigins = getAllowedOrigins();

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (getNodeEnv() === 'production') {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
  next();
});

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, Postman, or curl)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Allow Vercel preview deployments (any *.vercel.app domain)
        if (origin.endsWith(".vercel.app")) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/api/documents", documentsRouter);
app.use("/api/chat", chatRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

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
    
    // Don't leak error details in production
    const errorMessage = getNodeEnv() === 'production' 
      ? 'Internal server error' 
      : err.message || 'Internal server error';
    
    res.status(err.status || 500).json({
      error: errorMessage,
      ...(getNodeEnv() === 'development' && { stack: err.stack }),
    });
  }
);

app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available`);
});

server.timeout = 300000;

export default app;
