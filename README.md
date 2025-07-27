# Chat AI Application

A chat application based on React + Express + Azure OpenAI, supporting both regular chat and streaming responses.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies
npm run setup

# Or install separately
npm run install:server
npm run install:client
```

### 2. Configure Environment Variables

Copy and configure backend environment variables:

```bash
cp server/.env.example server/.env
```

Edit the `server/.env` file and fill in your Azure OpenAI configuration:

```env
# Server Configuration
PORT=3000

# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://your-resource-name.cognitiveservices.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_API_VERSION=2024-04-01-preview
AZURE_OPENAI_DEPLOYMENT=your-deployment-name
AZURE_OPENAI_MODEL=gpt-35-turbo

# Chat Configuration
MAX_TOKENS=4096
TEMPERATURE=1
TOP_P=1
```

### 3. Start Application

#### Method 1: Using npm scripts (Recommended)

```bash
# Full version startup (with logs and error checking)
npm start

# Simplified startup
npm run dev
```

#### Method 2: Using platform scripts

**macOS/Linux:**
```bash
./start.sh
```

**Windows:**
```cmd
start.bat
```

#### Method 3: Manual startup

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

## 📱 Access URLs

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health


http://localhost:5173:



## 🛠️ Development Commands

```bash
# Run tests
npm test

# Build frontend
npm run build

# Install dependencies
npm run install:all
```

## 📁 Project Structure

```
chat-ai/
├── client/          # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/          # Express backend
│   ├── __tests__/   # Test files
│   ├── app.js       # Application logic
│   ├── server.js    # Server entry point
│   ├── .env         # Environment variables
│   └── package.json
├── start.js         # Main startup script
├── dev.js           # Simplified startup script
├── start.sh         # Shell script
├── start.bat        # Batch script
└── package.json     # Root configuration
```

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check port usage
   lsof -i :3000
   lsof -i :5173
   
   # Kill process
   kill -9 <PID>
   ```

2. **Dependency installation failed**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Azure OpenAI connection failed**
   - Check `.env` file configuration
   - Confirm API key and endpoint are correct
   - Verify deployment name

4. **Frontend cannot connect to backend**
   - Confirm backend is running (http://localhost:3000/health)
   - Check Vite proxy configuration
   - Check browser console for errors


## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Watch mode
npm run test:watch
```


## 📚 References

### Core Documentation
- [React Official Documentation](https://react.dev/) - Frontend framework
- [Node.js Official Documentation](https://nodejs.org/docs/) - JavaScript runtime
- [Express.js Official Documentation](https://expressjs.com/) - Backend web framework

### Azure OpenAI Integration
- [Azure CLI Installation for macOS](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-macos?view=azure-cli-latest) - Get started with Azure Command-Line Interface (CLI)
- [OpenAI Node.js Azure Integration](https://github.com/openai/openai-node/blob/master/azure.md) - Azure-specific configuration guide
- [Azure AI Foundry OpenAI Supported Languages](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/supported-languages?tabs=dotnet-secure%2Csecure%2Cpython-secure%2Ccommand&pivots=programming-language-javascript) - JavaScript implementation guide
- [Azure AI Foundry OpenAI Reference](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/reference#transcriptions---create) - API reference documentation

### OpenAI API Documentation
- [Chat Completions API Reference](https://platform.openai.com/docs/api-reference/chat/create) - Core chat API documentation
- [Responses vs Chat Completions Guide](https://platform.openai.com/docs/guides/responses-vs-chat-completions?api-mode=responses#model-availability-in-each-api) - Model availability and API differences
- [Azure Chat Example (TypeScript)](https://github.com/openai/openai-node/blob/master/examples/azure/chat.ts) - Implementation example

### AI Assistant
- [Claude AI](https://claude.ai/) - Used for code organization, test writing, and bug fixing assistance

### Additional Resources

- [Azure Portal](https://portal.azure.com/) - Azure resource management

## 📄 License

MIT License

## 🤝 Contributing

Issues and Pull Requests are welcome!

---

**Note**: For first-time setup, make sure to properly configure the Azure OpenAI settings in the `server/.env` file.
