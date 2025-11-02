# 🚀 Getting Started - Quick Reference

## One-Time Setup (5 minutes)

### 1. Install Dependencies
```powershell
# From the project root directory
npm run install:all
```

### 2. Add Your OpenAI API Key
```powershell
# Open .env file and add:
OPENAI_API_KEY=sk-your-key-here
```

💡 Get your API key at: https://platform.openai.com/api-keys

## Running the Application

### Start Everything (Recommended)
```powershell
npm run dev
```

This starts both backend and frontend together!

### Or Start Separately

**Backend** (in one terminal):
```powershell
npm run dev:backend
```

**Frontend** (in another terminal):
```powershell
npm run dev:frontend
```

## Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## First Test

1. Open http://localhost:5173
2. Click "Upload Documents"
3. Upload a PDF or TXT file
4. Ask: "What is this document about?"
5. See the magic happen! ✨

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Change PORT in .env |
| API key error | Verify key in .env |
| Upload fails | Check file is PDF/TXT |
| No response | Upload documents first |

## Next Steps

1. ✅ Read README.md for full documentation
2. ✅ Check SETUP_GUIDE.md for detailed setup
3. ✅ Review TESTING_GUIDE.md for testing
4. ✅ See DEMO_SCRIPT.md for video recording

## Need Help?

Check the documentation files:
- `README.md` - Main documentation
- `SETUP_GUIDE.md` - Detailed setup
- `PROJECT_SUMMARY.md` - Architecture overview
- `TESTING_GUIDE.md` - Testing instructions

---

**You're all set! Have fun with your Personal Knowledge Assistant! 🎉**
