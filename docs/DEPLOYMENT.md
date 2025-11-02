# Deployment Guide

This guide covers deploying the Personal Knowledge Assistant to production environments.

## Deployment Options

This application supports deployment to:
- **Vercel** - Full-stack deployment (Frontend + API)
- **Railway** - Backend API deployment
- **Other platforms** - Using the build configurations

## Pre-Deployment Checklist

- [x] ✅ Application runs locally
- [x] ✅ Production-ready features implemented
- [x] ✅ Environment variables configured
- [x] ✅ CORS settings updated
- [x] ✅ Build configurations verified

## Deployment Configurations

### 1. Vercel Deployment (Full-Stack)

Vercel deploys both frontend and backend API as serverless functions.

#### Setup Steps

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Environment Variables** in Vercel Dashboard:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

#### Vercel Configuration (`vercel.json`)

- ✅ Frontend builds from `frontend/dist`
- ✅ API routes handled via `/api` serverless function
- ✅ Max duration: 300 seconds (5 minutes) for document processing
- ✅ Auto-rewrites configured for SPA routing

#### Notes

- Vercel automatically handles:
  - Preview deployments (PRs get their own URLs)
  - Production deployments
  - All `*.vercel.app` domains are auto-allowed for CORS
- The `api/index.ts` file serves as the serverless function handler
- File uploads are handled in-memory (max 10MB)

---

### 2. Railway Deployment (Backend API)

Railway is ideal for running the backend API as a persistent service.

#### Setup Steps

1. **Create Railway Account**:
   - Go to [railway.app](https://railway.app)
   - Create a new project

2. **Deploy from GitHub**:
   - Connect your repository
   - Railway will auto-detect `railway.json`

3. **Configure Environment Variables**:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   NODE_ENV=production
   PORT=3001 (auto-set by Railway, but specify if custom)
   FRONTEND_URL=https://your-frontend-domain.com
   ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

4. **Get Railway URL**:
   - Railway provides a public URL (e.g., `https://your-app.railway.app`)
   - Update your frontend's `VITE_API_URL` to this URL

#### Railway Configuration (`railway.json`)

- ✅ Builds backend with TypeScript compilation
- ✅ Health check on `/api/health`
- ✅ Auto-restart on failure
- ✅ Production mode enabled

#### Notes

- Railway provides persistent storage (unlike serverless)
- Better for applications requiring file uploads (though still in-memory here)
- Can scale horizontally if needed

---

### 3. Frontend-Only Deployment

If deploying frontend separately (e.g., Netlify, Vercel Frontend only):

1. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Update API URL**:
   Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

3. **Deploy**:
   - Upload `frontend/dist` to your hosting service
   - Or use platform-specific deployment commands

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `NODE_ENV` | Environment mode | `production` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `PORT` | Server port | `3001` | `3001` |
| `FRONTEND_URL` | Frontend deployment URL | `http://localhost:5173` | `https://app.vercel.app` |
| `ALLOWED_ORIGINS` | Comma-separated allowed origins | (see below) | `https://app.com,https://www.app.com` |

### CORS Origins

The application automatically allows:
- `FRONTEND_URL` value
- `http://localhost:5173` and `http://localhost:3000` (development)
- Any origin from `ALLOWED_ORIGINS` environment variable
- Any `*.vercel.app` domain (for Vercel preview deployments)

---

## Production Environment Variables

### Vercel

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```bash
GEMINI_API_KEY=your_api_key
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Railway

Set these in Railway Dashboard → Project → Variables:

```bash
GEMINI_API_KEY=your_api_key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com
PORT=3001
```

---

## Testing Deployment

### 1. Health Check

```bash
curl https://your-backend-url/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Personal Knowledge Assistant API is running",
  "timestamp": "2025-11-02T06:00:00.000Z",
  "platform": "vercel" // or "railway"
}
```

### 2. Test Document Upload

```bash
curl -X POST https://your-backend-url/api/documents/upload \
  -F "documents=@test.pdf"
```

### 3. Test Chat API

```bash
curl -X POST https://your-backend-url/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

### 4. Frontend Integration

1. Open your deployed frontend URL
2. Upload a test document
3. Ask a question
4. Verify responses and source citations

---

## Deployment Issues & Solutions

### CORS Errors

**Problem**: Frontend can't connect to backend

**Solution**:
- Verify `FRONTEND_URL` matches your frontend domain exactly
- Add frontend URL to `ALLOWED_ORIGINS`
- For Vercel: Preview URLs are auto-allowed (*.vercel.app)

### Environment Variables Not Loading

**Problem**: API key or other env vars not found

**Solution**:
- Check variable names (case-sensitive)
- Restart deployment after adding variables
- Verify `.env` file exists (local) or variables set (production)

### Build Failures

**Problem**: Deployment fails during build

**Solution**:
- Check Node.js version (v18+ required)
- Verify all dependencies in `package.json`
- Check build logs for specific errors
- Test build locally: `npm run build`

### API Timeouts

**Problem**: Document processing times out

**Solution**:
- Vercel: Max 300s configured (5 minutes)
- Railway: No timeout (persistent service)
- For large documents, consider chunking strategy

---

## Post-Deployment

### 1. Monitor Logs

- **Vercel**: Dashboard → Project → Functions → Logs
- **Railway**: Dashboard → Project → Deployments → Logs

### 2. Test All Features

- [ ] Document upload (PDF/TXT)
- [ ] Document listing
- [ ] Document deletion
- [ ] Chat functionality
- [ ] Source citations
- [ ] Error handling

### 3. Performance Optimization

- Monitor response times
- Check API usage limits
- Optimize document chunking if needed
- Consider caching strategies

---

## Production Best Practices

1. ✅ **Never commit API keys** - Use environment variables
2. ✅ **Enable production mode** - Set `NODE_ENV=production`
3. ✅ **Configure CORS properly** - Only allow your domains
4. ✅ **Monitor logs** - Check for errors regularly
5. ✅ **Set up health checks** - Monitor API availability
6. ✅ **Use HTTPS** - All production deployments should use SSL
7. ✅ **Regular backups** - Document data (if persistent storage added)

---

## Architecture Notes

### Vercel (Serverless)
- Each API call is a separate function invocation
- Cold starts possible (Vercel optimizes this)
- Stateless (no persistent memory between calls)
- File uploads stored in memory temporarily

### Railway (Container)
- Persistent process running continuously
- No cold starts
- Better for file handling (though still in-memory here)
- Can scale horizontally

---

## Support

For deployment issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Review CORS configuration
5. Check build output

**Ready to deploy!** 🚀

