import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Episodes API', () => {
  describe('GET /api/episodes', () => {
    it('should return paginated episodes', async () => {
      const response = await request(app)
        .get('/api/episodes')
        .expect(200);

      expect(response.body).toHaveProperty('info');
      expect(response.body).toHaveProperty('results');
      expect(response.body.info).toHaveProperty('count');
      expect(response.body.info).toHaveProperty('pages');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBeGreaterThan(0);

      // Verify episode structure
      const episode = response.body.results[0];
      expect(episode).toHaveProperty('id');
      expect(episode).toHaveProperty('name');
      expect(episode).toHaveProperty('air_date');
      expect(episode).toHaveProperty('episode');
      expect(episode).toHaveProperty('characters');
    });

    it('should filter by episode name', async () => {
      const response = await request(app)
        .get('/api/episodes?name=Pilot')
        .expect(200);

      expect(response.body.results.length).toBeGreaterThan(0);
      response.body.results.forEach((ep: { name: string }) => {
        expect(ep.name.toLowerCase()).toContain('pilot');
      });
    });

    it('should filter by episode code', async () => {
      const response = await request(app)
        .get('/api/episodes?episode=S01E01')
        .expect(200);

      expect(response.body.results.length).toBeGreaterThan(0);
      response.body.results.forEach((ep: { episode: string }) => {
        expect(ep.episode).toBe('S01E01');
      });
    });

    it('should support pagination', async () => {
      const page1 = await request(app)
        .get('/api/episodes?page=1')
        .expect(200);

      const page2 = await request(app)
        .get('/api/episodes?page=2')
        .expect(200);

      expect(page1.body.results).not.toEqual(page2.body.results);
      expect(page1.body.info.next).toBeTruthy();
    });
  });

  describe('GET /api/episodes/:id', () => {
    it('should return a single episode by ID', async () => {
      const response = await request(app)
        .get('/api/episodes/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'Pilot');
      expect(response.body).toHaveProperty('episode', 'S01E01');
      expect(response.body).toHaveProperty('air_date');
      expect(Array.isArray(response.body.characters)).toBe(true);
    });

    it('should return 404 for non-existent episode', async () => {
      await request(app)
        .get('/api/episodes/999999')
        .expect(404);
    });

    it('should return multiple episodes by comma-separated IDs', async () => {
      const response = await request(app)
        .get('/api/episodes/1,2,3')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
      expect(response.body[0]).toHaveProperty('id', 1);
      expect(response.body[1]).toHaveProperty('id', 2);
      expect(response.body[2]).toHaveProperty('id', 3);
    });

    it('should handle invalid episode ID gracefully', async () => {
      const response = await request(app)
        .get('/api/episodes/invalid')
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });
});
