import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Favorites API', () => {
  describe('GET /api/favorites', () => {
    it('should return empty array when no favorites', async () => {
      const response = await request(app)
        .get('/api/favorites')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination).toEqual({
        total: 0,
        page: 1,
        limit: 20,
        pages: 0,
      });
    });
  });

  describe('GET /api/favorites/ids', () => {
    it('should return empty array when no favorites', async () => {
      const response = await request(app)
        .get('/api/favorites/ids')
        .expect(200);

      expect(response.body).toEqual({ ids: [] });
    });
  });

  describe('POST /api/favorites', () => {
    it('should add a character to favorites', async () => {
      const response = await request(app)
        .post('/api/favorites')
        .send({ characterId: 1 })
        .expect(201);

      expect(response.body).toHaveProperty('characterId', 1);
      expect(response.body).toHaveProperty('name', 'Rick Sanchez');
      expect(response.body).toHaveProperty('status', 'Alive');
      expect(response.body).toHaveProperty('species', 'Human');
      expect(response.body).toHaveProperty('image');
    });

    it('should be idempotent - adding same character twice returns same favorite', async () => {
      // Add first time
      const first = await request(app)
        .post('/api/favorites')
        .send({ characterId: 2 })
        .expect(201);

      // Add second time
      const second = await request(app)
        .post('/api/favorites')
        .send({ characterId: 2 })
        .expect(201);

      expect(first.body._id).toEqual(second.body._id);
    });

    it('should return 400 for invalid characterId', async () => {
      const response = await request(app)
        .post('/api/favorites')
        .send({ characterId: 'invalid' })
        .expect(400);

      expect(response.body.error).toHaveProperty('message', 'Validation failed');
    });

    it('should return 404 for non-existent character', async () => {
      const response = await request(app)
        .post('/api/favorites')
        .send({ characterId: 999999 })
        .expect(404);

      expect(response.body.error.message).toContain('not found');
    });
  });

  describe('DELETE /api/favorites/:characterId', () => {
    it('should remove a favorite', async () => {
      // First add a favorite
      await request(app)
        .post('/api/favorites')
        .send({ characterId: 1 });

      // Then delete it
      await request(app)
        .delete('/api/favorites/1')
        .expect(204);

      // Verify it's gone
      const response = await request(app)
        .get('/api/favorites/ids')
        .expect(200);

      expect(response.body.ids).not.toContain(1);
    });

    it('should return 404 for non-existent favorite', async () => {
      await request(app)
        .delete('/api/favorites/999')
        .expect(404);
    });
  });

  describe('GET /api/favorites/check/:characterId', () => {
    it('should return false for non-favorited character', async () => {
      const response = await request(app)
        .get('/api/favorites/check/1')
        .expect(200);

      expect(response.body).toEqual({ isFavorite: false });
    });

    it('should return true for favorited character', async () => {
      // Add favorite first
      await request(app)
        .post('/api/favorites')
        .send({ characterId: 1 });

      const response = await request(app)
        .get('/api/favorites/check/1')
        .expect(200);

      expect(response.body).toEqual({ isFavorite: true });
    });
  });
});

describe('Characters API', () => {
  describe('GET /api/characters', () => {
    it('should return paginated characters', async () => {
      const response = await request(app)
        .get('/api/characters')
        .expect(200);

      expect(response.body).toHaveProperty('info');
      expect(response.body).toHaveProperty('results');
      expect(response.body.info).toHaveProperty('count');
      expect(response.body.info).toHaveProperty('pages');
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    it('should filter by name', async () => {
      const response = await request(app)
        .get('/api/characters?name=Rick')
        .expect(200);

      expect(response.body.results.length).toBeGreaterThan(0);
      response.body.results.forEach((char: { name: string }) => {
        expect(char.name.toLowerCase()).toContain('rick');
      });
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/characters?status=Dead')
        .expect(200);

      response.body.results.forEach((char: { status: string }) => {
        expect(char.status).toBe('Dead');
      });
    });
  });

  describe('GET /api/characters/:id', () => {
    it('should return a single character', async () => {
      const response = await request(app)
        .get('/api/characters/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'Rick Sanchez');
    });

    it('should return 404 for non-existent character', async () => {
      await request(app)
        .get('/api/characters/999999')
        .expect(404);
    });
  });
});

describe('Health API', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });
});
