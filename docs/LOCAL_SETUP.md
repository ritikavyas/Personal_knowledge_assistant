# Local Development Setup Guide

## Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory with the following:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Get your Gemini API key at:** https://aistudio.google.com/apikey

### 2. Install Dependencies (Already Done ✅)

```bash
npm run install:all
```

### 3. Run the Application

#### Development Mode (Recommended)
```bash
npm run dev
```

This starts both:
- Backend API on http://localhost:3001
- Frontend UI on http://localhost:5173

#### Production Build
```bash
# Build both frontend and backend
npm run build

# Start backend in production mode
npm run start

# Preview frontend build (in another terminal)
npm run preview
```

## Production-Ready Features Added

✅ **Error Handling**
- Comprehensive error middleware
- Input validation on all endpoints
- Safe error messages (no stack traces in production)

✅ **Security**
- Security headers (XSS protection, content-type options)
- CORS configuration
- Request size limits
- File type validation

✅ **Logging**
- Request logging with timestamps
- Response time tracking
- Error logging with context

✅ **Type Safety**
- TypeScript strict mode
- Proper type annotations
- Node.js type definitions

✅ **API Improvements**
- Request timeout handling (5 minutes for document processing)
- Better error messages
- Input validation and sanitization

## Troubleshooting

### Backend won't start
- Ensure `.env` file exists with `GEMINI_API_KEY`
- Check port 3001 is not in use: `lsof -i :3001`
- Verify Node.js version: `node --version` (should be v18+)

### Frontend won't connect to backend
- Ensure backend is running on port 3001
- Check CORS configuration in `backend/src/index.ts`
- Verify `FRONTEND_URL` in `.env` matches frontend URL

### API errors
- Check backend console for detailed error logs
- Verify Gemini API key is valid and has quota
- Ensure documents are uploaded before chatting

## Health Check

Test the API:
```bash
curl http://localhost:3001/api/health
```

## Project Structure

```
Personal_knowledge_assistant/
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/   # Environment configuration
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic
│   │   └── utils/    # Utilities
│   └── dist/         # Compiled JavaScript
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   └── dist/         # Built frontend
└── .env              # Environment variables (create this!)
```

## Next Steps

1. Create `.env` file with your Gemini API key
2. Run `npm run dev` to start development servers
3. Open http://localhost:5173 in your browser
4. Upload a document (PDF or TXT)
5. Ask questions about your documents!

Enjoy your Personal Knowledge Assistant! 🚀

