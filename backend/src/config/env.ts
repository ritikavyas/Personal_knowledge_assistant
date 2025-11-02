import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Try multiple paths to find the .env file (only for local development)
if (isDevelopment) {
  const possiblePaths = [
    path.resolve(__dirname, '../../.env'),           // From compiled dist/config
    path.resolve(__dirname, '../../../.env'),        // From src/config when using ts-node
    path.resolve(process.cwd(), '.env'),             // From current working directory
    path.resolve(process.cwd(), '../.env'),          // From backend directory
  ];

  let envLoaded = false;
  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      console.log(`Loading environment from: ${envPath}`);
      dotenv.config({ path: envPath });
      envLoaded = true;
      break;
    }
  }

  if (!envLoaded) {
    console.warn('Warning: Could not find .env file in expected locations');
    console.warn('Tried:', possiblePaths);
  }
} else {
  // In production, load from process.env (Railway, Heroku, etc. set env vars directly)
  // dotenv.config() without a path will try to load from .env, but won't fail if it doesn't exist
  dotenv.config();
}

// Validate required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error('\n❌ ERROR: GEMINI_API_KEY is not set!');
  
  if (isDevelopment) {
    console.error('Please add your Gemini API key to the .env file in the project root.');
    console.error('Example: GEMINI_API_KEY=your-api-key-here');
  } else {
    console.error('Please set the GEMINI_API_KEY environment variable in your deployment platform.');
    console.error('For Railway: Go to your project → Variables tab → Add GEMINI_API_KEY');
  }
  
  console.error('Get your free API key at: https://aistudio.google.com/apikey\n');
  process.exit(1);
}

// Export a function to get the API key
export const getGeminiKey = (): string => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return key;
};

export const getPort = (): number => {
  return parseInt(process.env.PORT || '3001', 10);
};

export const getFrontendUrl = (): string => {
  return process.env.FRONTEND_URL || 'http://localhost:5173';
};

export const getNodeEnv = (): string => {
  return process.env.NODE_ENV || 'development';
};

// Get additional allowed origins from environment variable (comma-separated)
export const getAllowedOrigins = (): string[] => {
  const additionalOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [];
  
  return [
    getFrontendUrl(),
    'http://localhost:5173',
    'http://localhost:3000',
    ...additionalOrigins,
  ];
};