import { createApp } from './app.js';

const port = process.env.PORT || 3000;

try {
  const app = createApp();
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
} catch (error) {
  console.error('Failed to start server:', error.message);
  process.exit(1);
}