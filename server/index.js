console.log('SESSION_SECRET', process.env.SESSION_SECRET);
import express from 'express';
import fs from 'fs';
import https from 'https';
import session from 'express-session';
import passport from './auth.js';

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

// Session and Passport setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS in production
}));
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Facebook OAuth routes
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

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