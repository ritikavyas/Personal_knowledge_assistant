export interface Document {
  id: string;
  filename: string;
  originalName: string;
  uploadDate: Date;
  chunks: DocumentChunk[];
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  text: string;
  embedding: number[];
  startIndex: number;
  endIndex: number;
  metadata: {
    chunkIndex: number;
    totalChunks: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
}

export interface Source {
  documentId: string;
  documentName: string;
  chunkId: string;
  text: string;
  similarity: number;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatResponse {
  message: ChatMessage;
  sources: Source[];
}
