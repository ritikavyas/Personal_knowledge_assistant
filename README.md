# Personal Knowledge Assistant

A production-ready full-stack TypeScript application for document-based Q&A using Retrieval-Augmented Generation (RAG) with Google Gemini.

## 🚀 Features

- **Document Upload**: Upload PDF or TXT files (up to 3 documents)
- **Intelligent Chunking**: Text extraction with overlap for context continuity
- **Semantic Search**: Vector embeddings for accurate document retrieval
- **AI Chat**: Ask questions about your documents with source citations
- **Modern UI**: Beautiful React interface with Tailwind CSS and Framer Motion

## 📋 Prerequisites

- Node.js v18 or higher
- npm or yarn
- Google Gemini API Key ([Get one here](https://aistudio.google.com/apikey))

## 🏃 Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Run Application

```bash
npm run dev
```

This starts:
- **Backend API**: http://localhost:3001
- **Frontend UI**: http://localhost:5173

## 📚 Documentation

- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deploy to Vercel or Railway
- **[Setup Guide](docs/LOCAL_SETUP.md)** - Detailed local setup instructions
- **[Getting Started](docs/GETTING_STARTED.md)** - Quick reference guide

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API calls

### Backend
- Node.js + Express
- TypeScript for type safety
- Google Gemini API (embeddings & chat)
- Multer for file uploads
- pdf-parse for PDF extraction

## 📁 Project Structure

```
personal-knowledge-assistant/
├── backend/           # Express API server
│   ├── src/
│   │   ├── config/   # Environment configuration
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic (RAG, embeddings)
│   │   └── utils/    # Utilities (storage)
├── frontend/          # React application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── services/  # API client
│   │   └── types/       # TypeScript types
├── api/               # Vercel serverless function
├── docs/              # Documentation
└── vercel.json        # Vercel configuration
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/documents/upload` | Upload documents |
| GET | `/api/documents` | List all documents |
| DELETE | `/api/documents/:id` | Delete a document |
| POST | `/api/chat` | Send chat message |

## 🚢 Deployment

### Vercel (Full-Stack)
```bash
vercel --prod
```

Set environment variables in Vercel dashboard:
- `GEMINI_API_KEY`
- `NODE_ENV=production`
- `FRONTEND_URL` (your Vercel URL)
- `ALLOWED_ORIGINS` (comma-separated URLs)

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

### Railway (Backend Only)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

## 🔧 Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Preview production build
npm run preview
```

## 🛡️ Production Features

- ✅ Request logging with timestamps
- ✅ Security headers (XSS protection, content-type options)
- ✅ Production-safe error handling
- ✅ Input validation and sanitization
- ✅ CORS configuration for multiple origins
- ✅ Request size limits (10MB)
- ✅ Health check endpoint

## 📝 License

MIT

## 👤 Author

Ritika

---

**Ready for production deployment!** 🎉
