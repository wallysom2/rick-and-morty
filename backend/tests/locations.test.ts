import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Locations API', () => {
  describe('GET /api/locations', () => {
    it('should return paginated locations', async () => {
      const response = await request(app)
        .get('/api/locations')
        .expect(200);

      expect(response.body).toHaveProperty('info');
      expect(response.body).toHaveProperty('results');
      expect(response.body.info).toHaveProperty('count');
      expect(response.body.info).toHaveProperty('pages');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBeGreaterThan(0);

      // Verify location structure
      const location = response.body.results[0];
      expect(location).toHaveProperty('id');
      expect(location).toHaveProperty('name');
      expect(location).toHaveProperty('type');
      expect(location).toHaveProperty('dimension');
      expect(location).toHaveProperty('residents');
    });

    it('should filter by location name', async () => {
      const response = await request(app)
        .get('/api/locations?name=Earth')
        .expect(200);

      expect(response.body.results.length).toBeGreaterThan(0);
      response.body.results.forEach((loc: { name: string }) => {
        expect(loc.name.toLowerCase()).toContain('earth');
      });
    });

    it('should filter by type', async () => {
      const response = await request(app)
        .get('/api/locations?type=Planet')
        .expect(200);

      expect(response.body.results.length).toBeGreaterThan(0);
      response.body.results.forEach((loc: { type: string }) => {
        expect(loc.type.toLowerCase()).toContain('planet');
      });
    });

    it('should filter by dimension', async () => {
      const response = await request(app)
        .get('/api/locations?dimension=C-137')
        .expect(200);

      expect(response.body.results.length).toBeGreaterThan(0);
      response.body.results.forEach((loc: { dimension: string }) => {
        expect(loc.dimension).toContain('C-137');
      });
    });

    it('should support pagination', async () => {
      const page1 = await request(app)
        .get('/api/locations?page=1')
        .expect(200);

      const page2 = await request(app)
        .get('/api/locations?page=2')
        .expect(200);

      expect(page1.body.results).not.toEqual(page2.body.results);
      expect(page1.body.info.next).toBeTruthy();
    });
  });

  describe('GET /api/locations/:id', () => {
    it('should return a single location by ID', async () => {
      const response = await request(app)
        .get('/api/locations/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'Earth (C-137)');
      expect(response.body).toHaveProperty('type', 'Planet');
      expect(response.body).toHaveProperty('dimension', 'Dimension C-137');
      expect(Array.isArray(response.body.residents)).toBe(true);
    });

    it('should return 404 for non-existent location', async () => {
      await request(app)
        .get('/api/locations/999999')
        .expect(404);
    });

    it('should return multiple locations by comma-separated IDs', async () => {
      const response = await request(app)
        .get('/api/locations/1,2,3')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
      expect(response.body[0]).toHaveProperty('id', 1);
      expect(response.body[1]).toHaveProperty('id', 2);
      expect(response.body[2]).toHaveProperty('id', 3);
    });

    it('should handle invalid location ID gracefully', async () => {
      const response = await request(app)
        .get('/api/locations/invalid')
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });
});
