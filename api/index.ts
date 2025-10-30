import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import chatRoutes from '../backend/src/routes/chat';
import documentRoutes from '../backend/src/routes/documents';

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/chat', chatRoutes);
app.use('/api/documents', documentRoutes);

// Export the Express app as a serverless function
export default async (req: VercelRequest, res: VercelResponse) => {
  // @ts-ignore
  return app(req, res);
};
