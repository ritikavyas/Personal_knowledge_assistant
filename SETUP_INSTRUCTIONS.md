# Setup Instructions for Personal Knowledge Assistant

## Quick Start

### 1. Install Dependencies

Run this command in the project root:

```bash
npm run install:all
```

This will install dependencies for:
- Root project
- Backend
- Frontend

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` and add your Gemini API key:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Get your free Gemini API key at:** https://aistudio.google.com/apikey

### 3. Run the Application

Start both backend and frontend:

```bash
npm run dev
```

This will start:
- **Backend API**: http://localhost:3001
- **Frontend UI**: http://localhost:5173

### 4. Access the Application

Open your browser and go to: **http://localhost:5173**

## Project Structure

```
Personal_knowledge_assistant/
├── backend/          # Express API server
│   ├── src/         # Source code
│   ├── package.json # Backend dependencies
│   └── tsconfig.json # TypeScript config
├── frontend/         # React application
│   ├── src/         # Source code
│   ├── package.json # Frontend dependencies
│   └── vite.config.ts
├── api/              # Vercel serverless function
├── .env.example      # Environment template
├── package.json      # Root package.json
└── README.md         # Main documentation
```

## Available Commands

### Development
```bash
npm run dev              # Start both frontend and backend
npm run dev:backend      # Start only backend
npm run dev:frontend     # Start only frontend
```

### Production Build
```bash
npm run build            # Build both frontend and backend
npm run start            # Start production server
npm run preview          # Preview production build
```

## Troubleshooting

### Backend won't start
- Check if `.env` file exists with `GEMINI_API_KEY`
- Verify port 3001 is not in use
- Check Node.js version: `node --version` (should be v18+)

### Frontend won't start
- Vite will automatically try next available port
- Check if port 5173 is available

### API errors
- Verify Gemini API key is correct in `.env`
- Check backend console for detailed errors
- Ensure documents are uploaded before chatting

### Build errors
- Run `npm run install:all` to ensure all dependencies are installed
- Check Node.js version (v18 or higher required)

## Requirements

- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **Gemini API Key**: Free API key from Google

## Need Help?

- Check `README.md` for detailed documentation
- Review `docs/` folder for additional guides
- Check backend console logs for error messages
- Verify all environment variables are set correctly

---

**Ready to go!** 🚀

