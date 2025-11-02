# Quick Start Guide

This guide will help you get the Personal Knowledge Assistant up and running in just a few minutes.

## Prerequisites Check

Before you begin, make sure you have:

- ✅ Node.js v18+ installed
- ✅ npm installed
- ✅ OpenAI API Key (get one at https://platform.openai.com/api-keys)

Check your versions:
```bash
node --version  # Should be v18 or higher
npm --version   # Should be 8 or higher
```

## Step-by-Step Setup

### 1. Install Dependencies

Open your terminal in the project root directory and run:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

**Or use the convenience command:**
```bash
npm run install:all
```

### 2. Set Up Environment Variables

1. Open the `.env` file in the root directory
2. Add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Important:** Keep your API key secure and never commit it to version control!

### 3. Start the Application

You have two options:

#### Option A: Run Both Services Together (Recommended)
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:3001
- Frontend UI on http://localhost:5173

#### Option B: Run Services Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

### 4. Access the Application

Open your browser and go to: **http://localhost:5173**

You should see the Personal Knowledge Assistant interface!

## Testing the Application

### Test 1: Upload a Document

1. Click "Upload Documents"
2. Select a PDF or TXT file
3. Wait for processing
4. See the document appear in the sidebar

### Test 2: Ask a Question

1. Type a question in the chat input
2. Press "Send" or hit Enter
3. Wait for the AI response
4. Click on sources to see the exact text used

### Test 3: Document Management

1. Upload multiple documents (up to 3)
2. Try deleting a document
3. Ask questions that reference multiple documents

## Troubleshooting

### Backend won't start

**Problem:** Port 3001 is already in use
**Solution:** 
- Find and stop the process using port 3001, or
- Change the PORT in `.env` file

### Frontend won't start

**Problem:** Port 5173 is already in use
**Solution:**
- Vite will automatically try the next available port
- Or manually specify a port in `frontend/vite.config.ts`

### OpenAI API Errors

**Problem:** "Invalid API key" or "Insufficient quota"
**Solution:**
- Verify your API key is correct in `.env`
- Check your OpenAI account has credits
- Restart the backend server after changing `.env`

### Documents not uploading

**Problem:** Upload fails or times out
**Solution:**
- Check file size (max 10MB)
- Ensure file is PDF or TXT format
- Check backend console for error messages

### No response from chat

**Problem:** Sending messages but no response
**Solution:**
- Upload at least one document first
- Check backend console for errors
- Verify OpenAI API key is valid

## API Endpoints Reference

If you need to test the API directly:

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Upload Documents
```bash
curl -X POST http://localhost:3001/api/documents/upload \
  -F "documents=@/path/to/your/file.pdf"
```

### List Documents
```bash
curl http://localhost:3001/api/documents
```

### Send Chat Message
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is this document about?"}'
```

## Next Steps

- Try uploading different types of documents
- Experiment with different questions
- Test the source highlighting feature
- Try uploading the maximum 3 documents
- Test document deletion

## Need Help?

- Check the main README.md for more detailed information
- Review the backend console logs for error messages
- Check the browser console for frontend errors
- Verify all environment variables are set correctly

Enjoy using your Personal Knowledge Assistant! 🚀
