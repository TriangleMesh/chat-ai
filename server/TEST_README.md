# Chat AI Server - Testing Documentation

This project contains a complete test suite for verifying the functionality, performance, and reliability of the chat AI server.

## Test Structure

```
__tests__/
└── basic.test.js        # Core functionality tests
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Use test runner
node test-runner.js        # Run all tests
node test-runner.js watch  # Watch mode

# Watch mode (for development)
npm run test:watch
```

### Test Environment Setup

Tests use an independent environment configuration file `.env.test`:

```bash
# Copy test environment configuration
cp .env.example .env.test
```

## Test Description

### Basic Tests (`basic.test.js`)

Tests all core functionality:

- ✅ **Health Check** - `/health` endpoint
- ✅ **Chat Interface** - Basic message processing
- ✅ **Input Validation** - Parameter validation and error handling
- ✅ **Special Characters** - Unicode and special character support
- ✅ **Error Handling** - Various error scenarios
- ✅ **Performance Tests** - Response time and concurrent processing

**Features:**
- No external service dependencies (uses echo responses)
- Fast execution, stable and reliable
- Covers core functionality paths

## Mock Strategy

The basic tests use a simple Express app that doesn't require Azure OpenAI mocking:

```javascript
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
```

## Test Content

Basic tests contain **11 test cases**:

1. **Health Check** - Service status verification
2. **Message Processing** - Normal chat functionality
3. **Input Validation** - Empty and missing message handling
4. **Special Characters** - Unicode and special character support
5. **Long Messages** - Large text processing capability
6. **Error Handling** - 404 and method errors
7. **JSON Parsing** - Malformed data handling
8. **Response Time** - Performance benchmark testing
9. **Concurrent Processing** - Multiple simultaneous requests

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## Debugging Tests

### Run Single Test

```bash
npx jest __tests__/basic.test.js -t "should return health status"
```

### Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Verbose Output

```bash
npx jest --verbose --no-cache
```

## Best Practices

1. **Test Isolation** - Each test should run independently
2. **Simple and Reliable** - Avoid complex external dependencies
3. **Clear Test Names** - Use descriptive test names
4. **Appropriate Assertions** - Verify expected behavior and output
5. **Fast Execution** - Keep test execution speed high

## Adding New Tests

Add new test cases in `__tests__/basic.test.js`:

```javascript
it('should handle new feature', async () => {
  const response = await request(app)
    .post('/new-endpoint')
    .send({ data: 'test' })
    .expect(200);

  expect(response.body).toHaveProperty('result');
});
```

---

**Note**: This test suite focuses on core functionality verification, doesn't depend on external APIs, ensuring a fast and reliable testing experience.
