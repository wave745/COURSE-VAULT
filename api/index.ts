/**
 * Vercel Serverless Function Entry Point
 * This file wraps the Express server for Vercel deployment
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import session from 'express-session';
import { registerRoutes } from '../server/routes';
import { serveStatic } from '../server/vite';
import { migrate } from '../server/migrate';

let app: express.Express | null = null;

// Initialize the app once (singleton pattern for Vercel)
async function getApp() {
  if (app) return app;

  app = express();

  // Configure session store for production
  let sessionStore: any = undefined;
  if (process.env.DATABASE_URL) {
    try {
      const ConnectPgSimple = (await import('connect-pg-simple')).default;
      const { pool } = await import('../server/db');
      const PgStore = ConnectPgSimple(session);
      sessionStore = new PgStore({
        pool: pool as any,
        createTableIfMissing: true,
      });
    } catch (error) {
      console.error('Failed to setup PostgreSQL session store:', error);
    }
  }

  app.use(session({
    secret: process.env.SESSION_SECRET || "iuo-student-archive-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }));

  declare module 'http' {
    interface IncomingMessage {
      rawBody: unknown
    }
  }

  app.use(express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  }));
  app.use(express.urlencoded({ extended: false }));

  // Run migrations on startup
  try {
    await migrate();
  } catch (error) {
    console.error('Migration error:', error);
  }

  // Register all routes
  await registerRoutes(app);

  // Serve static files in production (only needed for non-Vercel deployments)
  // Vercel handles static files automatically via rewrites
  if (!process.env.VERCEL) {
    serveStatic(app);
  }

  // Error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    
    // Convert Vercel request/response to Express format
    return new Promise<void>((resolve, reject) => {
      expressApp(req as any, res as any, (err: any) => {
        if (err) {
          console.error('Express error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

