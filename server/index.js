import express from 'express';
import fs from 'fs';
import https from 'https';

import { config, validateConfig } from './config.js';
import { corsMiddleware } from './middleware/cors.js';
import { setupViteMiddleware, setupClientRoutes } from './middleware/vite.js';
import apiRoutes from './routes/api.js';
import { logServerStart } from './utils/logger.js';

const app = express();

// Validate configuration
validateConfig();

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Setup Vite middleware for development
await setupViteMiddleware(app);

// API routes
app.use('/api', apiRoutes);

// Setup client routes (React app)
setupClientRoutes(app);

// Only start the server if this file is run directly
if (!config.isTest && import.meta.url === `file://${process.argv[1]}`) {
  try {
    // Try to read SSL certificates
    const sslOptions = {
      key: fs.readFileSync(config.ssl.keyPath),
      cert: fs.readFileSync(config.ssl.certPath),
    };
    
    https.createServer(sslOptions, app).listen(config.port, () => {
      logServerStart(config.port, true);
    });
  } catch (error) {
    // SSL certificates not found, use HTTP (local development)
    app.listen(config.port, () => {
      logServerStart(config.port, false);
    });
  }
}