import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { DocumentProcessor } from '../services/documentProcessor';
import { storage } from '../utils/storage';

const router = express.Router();

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  },
});

router.post('/upload', upload.array('documents', 3), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (files.length > 3) {
      return res.status(400).json({ error: 'Maximum 3 files allowed per upload' });
    }
    const currentDocCount = storage.getAllDocuments().length;
    if (currentDocCount + files.length > 3) {
      files.forEach(file => DocumentProcessor.deleteFile(file.path));
      return res.status(400).json({
        error: `Maximum 3 documents allowed. You currently have ${currentDocCount} document(s).`,
      });
    }

    const processedDocuments = [];
    for (const file of files) {
      try {
        const document = await DocumentProcessor.processFile(
          file.path,
          file.originalname
        );
        storage.addDocument(document);
        processedDocuments.push({
          id: document.id,
          originalName: document.originalName,
          chunks: document.chunks.length,
        });
        DocumentProcessor.deleteFile(file.path);
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        DocumentProcessor.deleteFile(file.path);
        return res.status(500).json({
          error: `Failed to process ${file.originalname}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }

    res.status(200).json({
      message: 'Documents uploaded and processed successfully',
      documents: processedDocuments,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: error.message || 'Failed to upload documents',
    });
  }
});

router.get('/', (req: Request, res: Response) => {
  try {
    const documents = storage.getAllDocuments();
    const documentList = documents.map(doc => ({
      id: doc.id,
      originalName: doc.originalName,
      uploadDate: doc.uploadDate,
      chunks: doc.chunks.length,
    }));

    res.status(200).json({
      documents: documentList,
      stats: storage.getStats(),
    });
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch documents',
    });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = storage.getDocument(id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const filePath = path.join(uploadDir, document.filename);
    DocumentProcessor.deleteFile(filePath);
    storage.deleteDocument(id);

    res.status(200).json({
      message: 'Document deleted successfully',
      documentId: id,
    });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      error: error.message || 'Failed to delete document',
    });
  }
});

export default router;
