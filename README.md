# Socket.IO v5 Go Client Examples

This repository contains example implementations of a Socket.IO v5 client written in Go, along with a mock server for testing.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/maldikhan/go.socket.io-examples/blob/main/LICENSE)

## Project Structure

- **`main.go`** - Go client example demonstrating Socket.IO v5 features
- **`mock-server/`** - NestJS-based mock Socket.IO server for testing

## Features

### Go Client
- Socket.IO v5 client implementation using [go.socket.io](https://github.com/maldikhan/go.socket.io)
- Custom high-speed JSON parser integration using [go.socket.io-parser.jsoniter](https://github.com/maldikhan/go.socket.io-parser.jsoniter)
- WebSocket transport configuration
- Event handling with acknowledgments and timeouts
- Context-based lifecycle management
- Structured logging with Zap

### Mock Server
- Built with NestJS and Socket.IO
- Provides test endpoints for all client features
- 100% test coverage
- Docker support for easy deployment

## Prerequisites

- Go 1.18 or higher
- Node.js v20 or higher (for mock server)
- Docker and Docker Compose (optional)

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/maldikhan/go.socket.io-examples.git
cd go.socket.io-examples

# Start both server and client
docker-compose up

# Or run them separately
docker-compose up mock-server  # Start server only
go run main.go                  # Run client locally
```

### Manual Setup

#### 1. Start the Mock Server

```bash
cd mock-server
yarn install
yarn start:dev
```

The server will start on port 3300.

#### 2. Run the Go Client

```bash
# From the root directory
go mod download
go run main.go
```

## Testing Scenarios

The mock server provides the following test endpoints:

1. **Connection Test** - Validates connection and authentication
2. **Simple Echo** (`hi`) - Basic request-response pattern
3. **Async Operations** (`delay`) - Tests timeouts and async handling
4. **Load Testing** (`load`) - High-frequency message handling
5. **Data Validation** (`get_square`, `get_sum`) - Complex data types and validation

## Code Examples

### Client Configuration

```go
// Custom client with high-performance parser
client, err := socketio_v5_client.NewClient(
    socketio_v5_client.WithEngineIOClient(eioClient),
    socketio_v5_client.WithLogger(logger),
    socketio_v5_client.WithParser(socketio_v5_parser_default.NewParser(
        socketio_v5_parser_default.WithPayloadParser(
            socketio_v5_parser_default_jsoniter.NewPayloadParser()
        ),
    )),
)
```

### Event Handling

```go
// Simple emit with acknowledgment
client.Emit("hi", emit.WithAck(func(response string) {
    fmt.Println("Server said:", response)
}))

// Emit with timeout
client.Emit("delay", 1000, 
    emit.WithAck(func(response string) {...}),
    emit.WithTimeout(500*time.Millisecond, func() {...})
)

// Handle server events
client.On("result", func(operation string, result int) {
    fmt.Printf("%s = %d\n", operation, result)
})
```

## Configuration

### Client Configuration

By default, the client connects to `http://127.0.0.1:3300`. You can change this using:

1. **Environment Variable**:
```bash
export SOCKETIO_SERVER_URL="http://your-server:port/socket.io/"
go run main.go
```

2. **Code Modification**:
```go
serverURL := "http://your-server:port/socket.io/"
eioClient, err := engineio_v4_client.NewClient(
    engineio_v4_client.WithRawURL(serverURL),
    // ... other options
)
```

### Server Configuration

The mock server runs on port 3300 by default. See `mock-server/README.md` for detailed configuration options.

## Development

### Running Tests

```bash
# Test the mock server
cd mock-server
yarn test        # Unit tests
yarn test:e2e    # End-to-end tests
yarn test:cov    # Coverage report
```

### Building Docker Images

```bash
# Build server image
docker build -t socketio-mock-server ./mock-server

# Or use docker-compose
docker-compose build
```

## Dependencies

### Go Client
- [go.socket.io](https://github.com/maldikhan/go.socket.io) - Socket.IO v5 client library for Go
- [go.socket.io-parser.jsoniter](https://github.com/maldikhan/go.socket.io-parser.jsoniter) - High-performance JSON parser
- [zap](https://github.com/uber-go/zap) - Structured logging library

### Mock Server
- [NestJS](https://nestjs.com/) - Node.js framework
- [Socket.IO](https://socket.io/) - Real-time bidirectional communication
- [Jest](https://jestjs.io/) - Testing framework

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.