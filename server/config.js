import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  livekit: {
    apiKey: process.env.LIVEKIT_API_KEY,
    apiSecret: process.env.LIVEKIT_API_SECRET,
  },
  ssl: {
    keyPath: path.join(process.cwd(), '..', 'ssl', 'express.key'),
    certPath: path.join(process.cwd(), '..', 'ssl', 'express.crt'),
  },
  client: {
    root: '../client',
    distPath: '../client/dist',
  },
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

// Validate required environment variables
export function validateConfig() {
  if (!config.livekit.apiKey || !config.livekit.apiSecret) {
    if (!config.isTest) {
      console.error('LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set in environment variables.');
      process.exit(1);
    }
  }
} 