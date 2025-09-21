import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/config/database';
import { sendSuccess } from '@/utils/response';
import { handleAsync } from '@/utils/errors';

export class HealthController {
  // Basic health check
  static healthCheck = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };

    sendSuccess(res, healthData, 'Health check successful');
  });

  // Detailed health check with database connectivity
  static detailedHealthCheck = handleAsync(async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();
    
    // Check database connectivity
    let dbStatus = 'OK';
    let dbResponseTime = 0;
    
    try {
      const dbStartTime = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbResponseTime = Date.now() - dbStartTime;
    } catch (error) {
      dbStatus = 'ERROR';
    }

    const responseTime = Date.now() - startTime;

    const healthData = {
      status: dbStatus === 'OK' ? 'OK' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: {
          status: dbStatus,
          responseTime: `${dbResponseTime}ms`,
        },
      },
      responseTime: `${responseTime}ms`,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
    };

    const statusCode = dbStatus === 'OK' ? 200 : 503;
    sendSuccess(res, healthData, 'Detailed health check completed', statusCode);
  });
}
