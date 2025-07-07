import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { config } from '../config.js';

export async function setupViteMiddleware(app) {
  if (config.isProduction) {
    return;
  }

  // Vite dev middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    root: config.client.root,
    appType: 'custom',
  });
  
  app.use(vite.middlewares);
  app.set('vite', vite);
}

export function setupClientRoutes(app) {
  if (config.isProduction) {
    console.log('Serving static files in production mode');
    // In production, serve built files from /client/dist
    app.use(express.static(config.client.distPath));

    // Only serve index.html for routes that don't look like static assets
    app.use('*', (req, res, next) => {
      const path = req.originalUrl;
      // Skip asset files with extensions like .js, .css, .png, etc.
      if (/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/.test(path)) {
        return next();
      }
      res.sendFile(path.resolve(config.client.distPath, 'index.html'));
    });
  } else {
    // Fallback: serve index.html for all other routes (for React Router)
    app.use('*', async (req, res, next) => {
      try {
        const vite = req.app.get('vite');
        if (!vite) {
          // Fallback for production: serve static index.html
          return res.sendFile(path.resolve(config.client.distPath, 'index.html'));
        }
        const url = req.originalUrl;
        let template = await vite.transformIndexHtml(
          url,
          fs.readFileSync(path.join(config.client.root, 'index.html'), 'utf-8')
        );
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  }
} 