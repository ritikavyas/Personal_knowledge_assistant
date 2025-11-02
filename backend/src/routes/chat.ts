import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ChatRequest, ChatMessage } from '../types';
import { RAGService } from '../services/ragService';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body as ChatRequest;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    if (message.length > 5000) {
      return res.status(400).json({ error: 'Message too long (max 5000 characters)' });
    }

    if (!Array.isArray(conversationHistory)) {
      return res.status(400).json({ error: 'conversationHistory must be an array' });
    }

    const { response, sources } = await RAGService.processQuery(
      message,
      conversationHistory
    );

    const assistantMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      sources: sources.length > 0 ? sources : undefined,
    };

    res.status(200).json({
      message: assistantMessage,
      sources,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error.message || 'Failed to process chat message',
    });
  }
});

export default router;
