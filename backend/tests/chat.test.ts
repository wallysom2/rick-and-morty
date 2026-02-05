import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Chat API', () => {
  describe('POST /api/chat', () => {
    // Test when OPENAI_API_KEY is not configured
    describe('without OPENAI_API_KEY', () => {
      it('should work if API key is configured or return error if not', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({
            message: 'Hello Rick!',
            character: 'rick',
          });

        // Either succeeds (if OPENAI_API_KEY is set) or fails with expected error
        if (response.status === 200) {
          expect(response.body).toHaveProperty('response');
          expect(response.body).toHaveProperty('character', 'rick');
        } else {
          // Should be 500 (chat disabled or OpenAI error)
          expect([500]).toContain(response.status);
          expect(response.body.error).toBeDefined();
        }
      });
    });

    // Validation tests (don't require OpenAI)
    describe('validation', () => {
      it('should return 400 for missing message', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({
            character: 'rick',
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toContain('Invalid');
      });

      it('should return 400 for missing character', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({
            message: 'Hello!',
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toContain('Invalid');
      });

      it('should return 400 for invalid character', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({
            message: 'Hello!',
            character: 'invalid',
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toContain('Invalid');
      });

      it('should return 400 for message too long', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({
            message: 'a'.repeat(1001), // Max is 1000
            character: 'rick',
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      });

      it('should return 400 for invalid history format', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({
            message: 'Hello!',
            character: 'rick',
            history: 'invalid', // Should be array
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      });

      it('should return 400 for history with invalid role', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({
            message: 'Hello!',
            character: 'rick',
            history: [
              { role: 'invalid', content: 'test' },
            ],
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      });

      it('should return 400 for history exceeding max items', async () => {
        const longHistory = Array(21).fill({ role: 'user', content: 'test' });
        
        const response = await request(app)
          .post('/api/chat')
          .send({
            message: 'Hello!',
            character: 'rick',
            history: longHistory,
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      });
    });

    // Test valid request structure (will fail without real API key, but tests validation)
    describe('request structure', () => {
      it('should accept valid rick chat request', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({
            message: 'Oi Rick, quem é você?',
            character: 'rick',
          });

        // Either succeeds (if OPENAI_API_KEY is set) or fails with expected error
        if (response.status === 200) {
          expect(response.body).toHaveProperty('response');
          expect(response.body).toHaveProperty('character', 'rick');
        } else {
          // Should be 500 (chat disabled) or 500 (OpenAI error)
          expect([500]).toContain(response.status);
        }
      });

      it('should accept valid morty chat request', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({
            message: 'Oi Morty!',
            character: 'morty',
          });

        if (response.status === 200) {
          expect(response.body).toHaveProperty('response');
          expect(response.body).toHaveProperty('character', 'morty');
        } else {
          expect([500]).toContain(response.status);
        }
      });

      it('should accept chat request with valid history', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({
            message: 'E aí?',
            character: 'rick',
            history: [
              { role: 'user', content: 'Oi Rick!' },
              { role: 'assistant', content: '*arroto* Oi.' },
            ],
          });

        if (response.status === 200) {
          expect(response.body).toHaveProperty('response');
          expect(response.body).toHaveProperty('character', 'rick');
        } else {
          expect([500]).toContain(response.status);
        }
      });
    });
  });
});
