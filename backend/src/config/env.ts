import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try multiple paths to find the .env file
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

// Validate required environment variables
// Allow a MOCK_EMBEDDINGS mode for local testing without Gemini credentials
const useMock = process.env.MOCK_EMBEDDINGS === 'true';
if (!process.env.GEMINI_API_KEY && !useMock) {
  console.error('\n❌ ERROR: GEMINI_API_KEY is not set!');
  console.error('Please add your Gemini API key to the .env file in the project root, or set MOCK_EMBEDDINGS=true for local testing without the API.');
  console.error('Get your free API key at: https://aistudio.google.com/apikey');
  console.error('Example: GEMINI_API_KEY=your-api-key-here\n');
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

export const useMockEmbeddings = (): boolean => {
  return process.env.MOCK_EMBEDDINGS === 'true';
};
