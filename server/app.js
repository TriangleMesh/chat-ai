import express from 'express';
import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get configuration from environment variables
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const modelName = process.env.AZURE_OPENAI_MODEL;

// Chat configuration
const maxTokens = parseInt(process.env.MAX_TOKENS) || 4096;
const temperature = parseFloat(process.env.TEMPERATURE) || 1;
const topP = parseFloat(process.env.TOP_P) || 1;

// Create application function
export function createApp() {
  const app = express();

  // Validate required environment variables
  if (!endpoint || !apiKey || !apiVersion || !deployment || !modelName) {
    throw new Error('Missing required environment variables. Please check your .env file.');
  }

  const client = new AzureOpenAI({ endpoint, apiKey, deployment, apiVersion });

  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Regular chat endpoint
  app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: 'Message required' });

    try {
      const response = await client.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
        top_p: topP,
        model: modelName
      });

      if (response?.error !== undefined && response.status !== "200") {
        throw response.error;
      }

      const result = response.choices[0].message.content;
      res.json({ reply: result });

    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Something went wrong", details: err.message || err });
    }
  });

  // Streaming chat endpoint
  app.post('/chat-stream', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: 'Message required' });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
      const stream = await client.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userMessage },
        ],
        stream: true,
        max_tokens: maxTokens,
        temperature: temperature,
        top_p: topP,
      });

      for await (const part of stream) {
        const content = part.choices[0]?.delta?.content;
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err) {
      console.error('Stream error:', err);
      res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
      res.end();
    }
  });

  return app;
}