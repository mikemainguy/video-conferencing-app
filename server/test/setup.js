import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });
 
// Set default test environment variables if not present
process.env.LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'test_api_key';
process.env.LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'test_api_secret';
process.env.PORT = process.env.PORT || '3002'; 