# Deployment Guide

This guide covers deploying the Personal Knowledge Assistant to production environments.

## Deployment Options

This application supports deployment to:
- **Vercel** - Full-stack deployment (Frontend + API)
- **Railway** - Backend API deployment
- **Hybrid: Vercel Frontend + Railway Backend** - Recommended for production (Best of both worlds)
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

3. **Configure Environment Variables** in Vercel Dashboard (CRITICAL):
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add the following variables:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
   - **Note**: Replace `your-app.vercel.app` with your actual Vercel URL
   - **Important**: Without `GEMINI_API_KEY`, the API will fail to start!
   - **Tip**: The frontend automatically uses `/api` (relative URL) when deployed to Vercel

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

### 2. Hybrid Deployment: Vercel Frontend + Railway Backend ⭐ RECOMMENDED

This setup gives you the best of both worlds:
- **Vercel**: Fast CDN for frontend, automatic HTTPS, great developer experience
- **Railway**: Persistent backend service, better for file handling, no cold starts

#### Setup Steps

**Step 1: Deploy Backend to Railway**

1. **Create Railway Project**:
   - Go to [railway.app](https://railway.app)
   - Create a new project
   - Connect your GitHub repository

2. **Configure Railway Environment Variables**:
   - Go to Railway Dashboard → Your Project → Variables tab
   - Add the following variables:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   NODE_ENV=production
   FRONTEND_URL=https://personal-knowledge-assistant-mcmx-okca17hhd-ritikavyas-projects.vercel.app
   ALLOWED_ORIGINS=https://personal-knowledge-assistant-mcmx-okca17hhd-ritikavyas-projects.vercel.app
   ```
   - **Replace** the Vercel URL above with your actual Vercel frontend URL
   - Railway will auto-deploy after setting variables

3. **Get Railway Backend URL**:
   - After deployment, Railway provides a public URL
   - Example: `https://your-app-production.up.railway.app`
   - **Copy this URL** - you'll need it for the frontend

**Step 2: Deploy Frontend to Vercel**

1. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect configuration from `vercel.json`

2. **Configure Vercel Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add the following:
   ```
   VITE_API_URL=https://your-app-production.up.railway.app/api
   ```
   - **Replace** with your actual Railway backend URL (don't forget `/api` at the end)
   - Vercel will automatically redeploy

**Step 3: Update Railway CORS (if needed)**

After deploying the frontend, verify your Railway backend's `FRONTEND_URL` and `ALLOWED_ORIGINS` match your Vercel URL exactly (including `https://`).

#### Testing the Hybrid Setup

1. **Test Frontend**: Visit your Vercel URL
2. **Test Backend Health**: Visit `https://your-railway-url.railway.app/api/health`
3. **Test Integration**: 
   - Upload a document from the Vercel frontend
   - Verify it reaches the Railway backend
   - Test chat functionality

#### Troubleshooting

- **CORS Errors**: Ensure Railway's `FRONTEND_URL` and `ALLOWED_ORIGINS` match your Vercel URL exactly
- **404 Errors**: Make sure `VITE_API_URL` in Vercel includes `/api` at the end (e.g., `https://backend.railway.app/api`)
- **Connection Issues**: Check Railway logs to ensure backend is running and accessible

---

### 3. Railway Deployment (Backend API)

Railway is ideal for running the backend API as a persistent service.

#### Setup Steps

1. **Create Railway Account**:
   - Go to [railway.app](https://railway.app)
   - Create a new project

2. **Deploy from GitHub**:
   - Connect your repository
   - Railway will auto-detect `railway.json`

3. **Configure Environment Variables** (IMPORTANT):
   - Go to Railway Dashboard → Your Project → Variables tab
   - Click "New Variable" and add the following:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.com
   ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```
   - **For Hybrid Setup**: Replace `your-frontend-domain.com` with your Vercel frontend URL
   - **Note**: `PORT` is auto-set by Railway, no need to specify unless custom
   - **Critical**: Without `GEMINI_API_KEY`, the application will fail to start!

4. **Get Railway URL**:
   - Railway provides a public URL (e.g., `https://your-app-production.up.railway.app`)
   - For hybrid setup: Use this URL in Vercel's `VITE_API_URL` environment variable
   - Format: `https://your-app-production.up.railway.app/api` (include `/api`)

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

### 4. Frontend-Only Deployment

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

### Hybrid Setup: Vercel Frontend + Railway Backend ⭐

**Vercel Environment Variables** (Frontend):
```bash
VITE_API_URL=https://your-app-production.up.railway.app/api
```
- Replace with your actual Railway backend URL
- **Important**: Include `/api` at the end

**Railway Environment Variables** (Backend):
```bash
GEMINI_API_KEY=your_api_key
NODE_ENV=production
FRONTEND_URL=https://personal-knowledge-assistant-mcmx-okca17hhd-ritikavyas-projects.vercel.app
ALLOWED_ORIGINS=https://personal-knowledge-assistant-mcmx-okca17hhd-ritikavyas-projects.vercel.app
```
- Replace Vercel URL with your actual frontend URL
- `PORT` is auto-set by Railway (no need to specify)

### Vercel (Full-Stack)

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```bash
GEMINI_API_KEY=your_api_key
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Railway (Backend Only)

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
- **Railway**: Go to Project → Variables tab → Ensure `GEMINI_API_KEY` is set
- Check variable names (case-sensitive: `GEMINI_API_KEY` not `gemini_api_key`)
- Restart deployment after adding variables (Railway auto-restarts)
- Verify `.env` file exists (local development only)
- In production, environment variables must be set in the platform dashboard, not via `.env` files

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

