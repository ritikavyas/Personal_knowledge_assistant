# Personal Knowledge Assistant (Simple RAG)

A full-stack TypeScript application that allows you to upload documents (PDF/TXT) and ask questions about them using Retrieval-Augmented Generation (RAG).

## Features

### Core Features
- ✅ Upload 1-3 documents (PDF/TXT)
- ✅ Extract and chunk text (500 tokens with overlap)
- ✅ Store chunks in-memory with embeddings
- ✅ Chat interface for asking questions
- ✅ Retrieve relevant chunks and send to LLM with context
- ✅ Show which document the answer came from
- ✅ Basic conversation history

### Bonus Features
- ✅ Chunk overlap strategy (100 tokens)
- ✅ Highlight exact source text
- ✅ Multiple document comparison
- ✅ Delete documents

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Multer** for file uploads
- **pdf-parse** for PDF text extraction
- **Gemini API** for embeddings and completions

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Gemini API Key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd personal-knowledge-assistant
```

### 2. Install Dependencies

```bash
npm run install:all
```

This will install dependencies for both the backend and frontend.

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Gemini API key:

```
Gemini_API_KEY=your_actual_Gemini_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Run the Application

#### Option 1: Run Both Frontend and Backend Together

```bash
npm run dev
```

#### Option 2: Run Separately

**Backend (Terminal 1):**
```bash
npm run dev:backend
```

**Frontend (Terminal 2):**
```bash
npm run dev:frontend
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

The backend API will be running on:
```
http://localhost:3001
```

## Usage Guide

### 1. Upload Documents
- Click the "Upload Documents" button
- Select 1-3 PDF or TXT files
- Wait for the files to be processed and chunked

### 2. Ask Questions
- Type your question in the chat input
- The system will retrieve relevant chunks from your documents
- Receive an answer with source attribution
- Click on sources to see the exact text used

### 3. Manage Documents
- View all uploaded documents in the sidebar
- Delete documents you no longer need
- Upload new documents as needed

## Architecture

### RAG Implementation

1. **Document Processing**
   - PDF/TXT files are uploaded and parsed
   - Text is split into chunks (~500 tokens)
   - Chunks have 100-token overlap for context continuity

2. **Embedding Generation**
   - Each chunk is converted to an embedding using Gemini's `text-embedding-004` model
   - Embeddings are stored in-memory with metadata

3. **Query Processing**
   - User query is converted to an embedding
   - Cosine similarity is used to find the most relevant chunks
   - Top 3 chunks are retrieved

4. **Response Generation**
   - Retrieved chunks are sent to Gemini's GPT model as context
   - The LLM generates a response based on the context
   - Source documents and chunks are tracked and returned

## Project Structure

```
personal-knowledge-assistant/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server setup
│   │   ├── routes/
│   │   │   ├── documents.ts      # Document upload/delete routes
│   │   │   └── chat.ts           # Chat endpoint
│   │   ├── services/
│   │   │   ├── documentProcessor.ts  # Text extraction & chunking
│   │   │   ├── embeddingService.ts   # Embedding generation
│   │   │   └── ragService.ts         # RAG logic
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript types
│   │   └── utils/
│   │       └── storage.ts        # In-memory storage
│   ├── uploads/                  # Uploaded files
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main app component
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx     # Chat UI
│   │   │   ├── DocumentList.tsx      # Document management
│   │   │   ├── UploadModal.tsx       # Upload UI
│   │   │   └── MessageBubble.tsx     # Chat messages
│   │   ├── services/
│   │   │   └── api.ts           # API client
│   │   └── types/
│   │       └── index.ts         # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── package.json
├── .env.example
└── README.md
```

## API Endpoints

### Documents

- `POST /api/documents/upload` - Upload documents
- `GET /api/documents` - List all documents
- `DELETE /api/documents/:id` - Delete a document

### Chat

- `POST /api/chat` - Send a message and get a response with sources

## Testing

### Manual Testing Checklist

1. **Document Upload**
   - [ ] Upload PDF file
   - [ ] Upload TXT file
   - [ ] Upload multiple files
   - [ ] Verify chunking

2. **Chat Functionality**
   - [ ] Ask questions about uploaded documents
   - [ ] Verify source attribution
   - [ ] Check conversation history
   - [ ] Test with no documents uploaded

3. **Document Management**
   - [ ] View document list
   - [ ] Delete documents
   - [ ] Verify deletion affects chat

## Limitations & Future Improvements

### Current Limitations
- In-memory storage (data lost on server restart)
- Max 3 documents at a time
- Simple text chunking (no semantic chunking)
- Basic embedding similarity search

### Future Improvements
- [ ] Persistent storage (database)
- [ ] Vector database integration (Pinecone, Weaviate)
- [ ] Advanced chunking strategies
- [ ] Support for more file types (DOCX, PPTX)
- [ ] Multi-user support with authentication
- [ ] Conversation branching
- [ ] Export chat history
- [ ] Fine-tuning on specific domains

## Demo Video

[Link to 5-minute demo video will be added here]

## License

MIT

## Author

Ritika

---

**Note:** This project is built as a demonstration of RAG implementation and full-stack development skills. Make sure to keep your Gemini API key secure and never commit it to version control.
