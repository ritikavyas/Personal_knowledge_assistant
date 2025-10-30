import { Document, DocumentChunk } from '../types';

class InMemoryStorage {
  private documents: Map<string, Document> = new Map();
  private chunks: Map<string, DocumentChunk> = new Map();

  // Document operations
  addDocument(document: Document): void {
    this.documents.set(document.id, document);
    document.chunks.forEach(chunk => {
      this.chunks.set(chunk.id, chunk);
    });
  }

  getDocument(id: string): Document | undefined {
    return this.documents.get(id);
  }

  getAllDocuments(): Document[] {
    return Array.from(this.documents.values());
  }

  deleteDocument(id: string): boolean {
    const document = this.documents.get(id);
    if (!document) return false;

    // Delete all chunks associated with this document
    document.chunks.forEach(chunk => {
      this.chunks.delete(chunk.id);
    });

    return this.documents.delete(id);
  }

  // Chunk operations
  getAllChunks(): DocumentChunk[] {
    return Array.from(this.chunks.values());
  }

  getChunksByDocumentId(documentId: string): DocumentChunk[] {
    return Array.from(this.chunks.values()).filter(
      chunk => chunk.documentId === documentId
    );
  }

  // Clear all data
  clear(): void {
    this.documents.clear();
    this.chunks.clear();
  }

  // Get statistics
  getStats() {
    return {
      totalDocuments: this.documents.size,
      totalChunks: this.chunks.size,
    };
  }
}

export const storage = new InMemoryStorage();
