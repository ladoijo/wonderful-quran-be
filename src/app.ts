import cors from 'cors';
import type { Application } from 'express';
import express from 'express';
import pino from 'pino';
import { pinoHttp } from 'pino-http';
import quranRoutes from '@/routes/qf.routes.js';

interface AppError extends Error {
  status?: number;
  details?: unknown;
}

const enablePrettyLogs =
  process.env.AWS_LAMBDA_FUNCTION_NAME === undefined && process.env.NODE_ENV !== 'production';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  ...(enablePrettyLogs
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true
          }
        }
      }
    : {})
});

export function createApp(): Application {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(
    pinoHttp({
      logger,
      autoLogging: true,
      serializers: {
        req(req) {
          return { method: req.method, url: req.url };
        }
      }
    })
  );
  app.get('/health', (_, res) => res.json({ ok: true }));
  app.use('/api', quranRoutes);
  app.use(
    (err: AppError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err?.status ?? 500;
      res.status(status).json({
        message: err?.message ?? 'Internal Server Error',
        ...(err?.details ? { details: err.details } : {})
      });
    }
  );
  return app;
}
