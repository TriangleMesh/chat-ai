# Chat AI Assistant - Frontend

This is a frontend application built with React + Vite for AI chat interactions, supporting communication with OpenAI API.

## Features

- Clean and intuitive user interface
- Support for asking questions and receiving AI responses
- Real-time loading status display
- Error handling and user feedback
- Responsive design
- Streaming and regular response modes

## Tech Stack

- React 19
- Vite
- CSS3 (modern styling with gradients)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Make sure the backend server is running at http://localhost:3000

## Project Structure

- `src/App.jsx` - Main application component with chat logic
- `src/App.css` - Application styles
- `vite.config.js` - Vite configuration with API proxy settings

## API Communication

The frontend communicates with the backend through `/api/chat` and `/api/chat-stream` endpoints, sending POST requests with user messages and receiving AI responses.

## Usage

1. Enter your question in the text input
2. Toggle between streaming and regular response modes
3. Press Enter or click send to submit
4. Wait for the AI response to appear
5. Error messages will be displayed if any issues occur