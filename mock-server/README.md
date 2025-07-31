# Socket.IO Mock Server

A mock Socket.IO server built with NestJS for testing and demonstrating the Go Socket.IO client library.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/maldikhan/go.socket.io-examples/blob/main/LICENSE)

## Purpose

This server is designed specifically for testing the [go.socket.io](https://github.com/maldikhan/go.socket.io) client library. It provides various WebSocket endpoints that demonstrate different Socket.IO features and allow comprehensive testing of the Go client implementation.

## Features

The mock server implements the following test scenarios:

### Connection Handling
- Emits `demo-connected` event upon successful connection
- Supports authentication via connection auth parameters
- Handles connection state recovery

### Test Endpoints

1. **`hi` - Simple Echo Test**
   - Tests basic request-response pattern
   - Returns personalized greeting using auth.userName

2. **`delay` - Async Response Test**
   - Tests async operations and timeouts
   - Validates delay duration (max 1000ms)
   - Useful for testing client timeout handling

3. **`load` - Bulk Message Test**
   - Tests high-frequency message handling
   - Emits multiple `boom` events based on input
   - Useful for load testing and event buffering

4. **`get_square` - Math Operation with Validation**
   - Tests input validation (range: -1000 to 1000)
   - Emits result via separate `result` event
   - Tests event emission patterns

5. **`get_sum` - Array Processing Test**
   - Tests complex data type handling (number arrays)
   - Validates array length (max 10 elements) and value ranges
   - Tests error responses

## Running the Server

### Using Docker (Recommended)

```bash
docker build -t socketio-mock-server .
docker run -p 3300:3300 socketio-mock-server
```

### Local Development

```bash
# Install dependencies
yarn install

# Run in development mode
yarn start:dev

# Run tests
yarn test
yarn test:e2e
```

The server runs on port 3300 by default.

## Integration with Go Client

This server is designed to work with the examples in [go.socket.io-examples](https://github.com/maldikhan/go.socket.io-examples). See the parent directory README for complete setup instructions.

## Test Coverage

The project maintains 100% test coverage:
- Unit tests for all components
- E2E tests for WebSocket functionality

Run `yarn test:cov` to generate coverage report.