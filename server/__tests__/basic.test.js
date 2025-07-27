import request from 'supertest';
import express from 'express';

// Create a simple test app that doesn't depend on Azure OpenAI
function createTestApp() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mock chat endpoint
  app.post('/chat', (req, res) => {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }
    res.json({ reply: `Echo: ${message}` });
  });

  return app;
}

describe('Basic Server Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(typeof response.body.timestamp).toBe('string');
    });
  });

  describe('POST /chat', () => {
    it('should echo message back', async () => {
      const testMessage = 'Hello, world!';
      
      const response = await request(app)
        .post('/chat')
        .send({ message: testMessage })
        .expect(200);

      expect(response.body).toEqual({
        reply: `Echo: ${testMessage}`
      });
    });

    it('should return 400 for missing message', async () => {
      const response = await request(app)
        .post('/chat')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        error: 'Message required'
      });
    });

    it('should return 400 for empty message', async () => {
      const response = await request(app)
        .post('/chat')
        .send({ message: '' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Message required'
      });
    });

    it('should handle special characters', async () => {
      const testMessage = 'Hello! 🚀 How are you? Unicode test';
      
      const response = await request(app)
        .post('/chat')
        .send({ message: testMessage })
        .expect(200);

      expect(response.body.reply).toBe(`Echo: ${testMessage}`);
    });

    it('should handle long messages', async () => {
      const longMessage = 'A'.repeat(1000);
      
      const response = await request(app)
        .post('/chat')
        .send({ message: longMessage })
        .expect(200);

      expect(response.body.reply).toBe(`Echo: ${longMessage}`);
    });
  });

  describe('Error handling', () => {
    it('should return 404 for non-existent routes', async () => {
      await request(app)
        .get('/non-existent')
        .expect(404);
    });

    it('should return 404 for wrong HTTP method', async () => {
      await request(app)
        .get('/chat')
        .expect(404);
    });

    it('should handle malformed JSON', async () => {
      await request(app)
        .post('/chat')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);
    });
  });

  describe('Performance', () => {
    it('should respond quickly to health checks', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/health')
        .expect(200);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill().map((_, i) =>
        request(app)
          .post('/chat')
          .send({ message: `Message ${i}` })
          .expect(200)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach((response, i) => {
        expect(response.body.reply).toBe(`Echo: Message ${i}`);
      });
    });
  });
});