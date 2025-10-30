export interface Document {
  id: string;
  originalName: string;
  uploadDate: string;
  chunks: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Source[];
}

export interface Source {
  documentId: string;
  documentName: string;
  chunkId: string;
  text: string;
  similarity: number;
}

export interface DocumentStats {
  totalDocuments: number;
  totalChunks: number;
}
