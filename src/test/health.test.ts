import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index';

describe('Health Check', () => {
  describe('GET /health', () => {
    it('should return basic health check', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'OK');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('environment');
      expect(response.body.data).toHaveProperty('version');
    });
  });

  describe('GET /health/detailed', () => {
    it('should return detailed health check', async () => {
      const response = await request(app)
        .get('/health/detailed');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('environment');
      expect(response.body.data).toHaveProperty('version');
      expect(response.body.data).toHaveProperty('services');
      expect(response.body.data).toHaveProperty('responseTime');
      expect(response.body.data).toHaveProperty('memory');
      expect(response.body.data.services).toHaveProperty('database');
    });
  });
});
