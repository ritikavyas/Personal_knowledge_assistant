import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import { Document, DocumentChunk } from '../types';
import { EmbeddingService } from './embeddingService';

export class DocumentProcessor {
  private static readonly CHUNK_SIZE = 1000; // Increased for better context (approx 250 tokens)
  private static readonly CHUNK_OVERLAP = 200; // Increased overlap for continuity
  private static readonly MIN_CHUNK_SIZE = 100; // Minimum viable chunk size

  /**
   * Process an uploaded file
   */
  static async processFile(
    filePath: string,
    originalName: string
  ): Promise<Document> {
    console.log(`[DocumentProcessor] Extracting text from ${originalName}...`);
    const text = await this.extractText(filePath, originalName);
    console.log(`[DocumentProcessor] Extracted ${text.length} characters`);
    
    console.log(`[DocumentProcessor] Chunking text...`);
    const chunks = await this.chunkText(text);
    console.log(`[DocumentProcessor] Created ${chunks.length} chunks`);
    
    const documentId = uuidv4();
    const documentChunks: DocumentChunk[] = [];

    // Generate embeddings for all chunks
    console.log(`[DocumentProcessor] Generating embeddings for ${chunks.length} chunks...`);
    const chunkTexts = chunks.map(c => c.text);
    const embeddings = await EmbeddingService.generateEmbeddings(chunkTexts);
    console.log(`[DocumentProcessor] Generated ${embeddings.length} embeddings`);

    // Create document chunks with embeddings
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      documentChunks.push({
        id: uuidv4(),
        documentId,
        text: chunk.text,
        embedding: embeddings[i],
        startIndex: chunk.startIndex,
        endIndex: chunk.endIndex,
        metadata: {
          chunkIndex: i,
          totalChunks: chunks.length,
        },
      });
    }

    return {
      id: documentId,
      filename: path.basename(filePath),
      originalName,
      uploadDate: new Date(),
      chunks: documentChunks,
    };
  }

  /**
   * Extract text from PDF or TXT file
   */
  private static async extractText(filePath: string, originalName: string): Promise<string> {
    // Use the original filename to determine the file type
    const extension = path.extname(originalName).toLowerCase();

    if (extension === '.pdf') {
      return await this.extractFromPDF(filePath);
    } else if (extension === '.txt') {
      return await this.extractFromTXT(filePath);
    } else {
      throw new Error(`Unsupported file type: ${extension}. Only PDF and TXT files are supported.`);
    }
  }

  /**
   * Extract text from PDF
   */
  private static async extractFromPDF(filePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse PDF file');
    }
  }

  /**
   * Extract text from TXT file
   */
  private static async extractFromTXT(filePath: string): Promise<string> {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error('Error reading TXT file:', error);
      throw new Error('Failed to read TXT file');
    }
  }

  /**
   * Split text into chunks with overlap using smart boundary detection
   */
  private static async chunkText(
    text: string
  ): Promise<Array<{ text: string; startIndex: number; endIndex: number }>> {
    // Clean the text but preserve paragraph breaks
    const cleanedText = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
      .replace(/[ \t]+/g, ' ')    // Normalize spaces
      .trim();
    
    if (!cleanedText) {
      throw new Error('Document contains no text');
    }

    const chunks: Array<{ text: string; startIndex: number; endIndex: number }> = [];
    const chunkSize = this.CHUNK_SIZE;
    const overlap = this.CHUNK_OVERLAP;

    let startIndex = 0;
    const textLength = cleanedText.length;

    while (startIndex < textLength) {
      // Calculate end index for this chunk
      let endIndex = Math.min(startIndex + chunkSize, textLength);
      
      // Get the chunk text
      let chunkText = cleanedText.substring(startIndex, endIndex);

      // Smart boundary detection: prefer paragraph > sentence > word boundaries
      if (endIndex < textLength) {
        // 1. Try paragraph break first (highest priority)
        const lastParagraph = chunkText.lastIndexOf('\n\n');
        if (lastParagraph > chunkSize * 0.4) {
          endIndex = startIndex + lastParagraph + 2;
          chunkText = cleanedText.substring(startIndex, endIndex);
        } else {
          // 2. Try sentence boundaries
          const sentenceEndings = [
            chunkText.lastIndexOf('. '),
            chunkText.lastIndexOf('.\n'),
            chunkText.lastIndexOf('? '),
            chunkText.lastIndexOf('! '),
            chunkText.lastIndexOf('.\t'),
          ];
          const lastSentence = Math.max(...sentenceEndings);

          if (lastSentence > chunkSize * 0.5) {
            endIndex = startIndex + lastSentence + 2;
            chunkText = cleanedText.substring(startIndex, endIndex);
          } else {
            // 3. Try word boundary
            const lastSpace = chunkText.lastIndexOf(' ');
            if (lastSpace > chunkSize * 0.7) {
              endIndex = startIndex + lastSpace + 1;
              chunkText = cleanedText.substring(startIndex, endIndex);
            }
          }
        }
      }

      // Add chunk if it meets minimum size
      const trimmedChunk = chunkText.trim();
      if (trimmedChunk.length >= this.MIN_CHUNK_SIZE) {
        chunks.push({
          text: trimmedChunk,
          startIndex,
          endIndex,
        });
      }

      // Move to next chunk with overlap
      const chunkLength = endIndex - startIndex;
      const step = Math.max(chunkLength - overlap, 1);
      startIndex += step;

      // Safety check to prevent infinite loops
      if (chunks.length > 10000) {
        console.error('Too many chunks generated, stopping to prevent memory issues');
        break;
      }
    }

    return chunks;
  }

  /**
   * Delete uploaded file
   */
  static deleteFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}
