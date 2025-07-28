# Socket.IO v5 Go Client Example

This repository contains an example implementation of a Socket.IO v5 client written in Go, demonstrating the usage of custom high-performance parsers.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/maldikhan/go.socket.io/blob/main/LICENSE)

## Features

- Socket.IO v5 client implementation using [go.socket.io](https://github.com/maldikhan/go.socket.io)
- Custom high-speed JSON parser integration using [go.socket.io-parser.jsoniter](https://github.com/maldikhan/go.socket.io-parser.jsoniter)
- WebSocket transport configuration
- Event handling with acknowledgments and timeouts
- Context-based lifecycle management
- Structured logging with Zap

## Prerequisites

- Go 1.18 or higher
- A running Socket.IO server (default: `http://127.0.0.1:3001`)

## Installation

```bash
git clone https://github.com/yourusername/socket-io.examples.git
cd socket-io.examples
go mod download
```

## Usage

### Running the Example

```bash
go run main.go
```

### Code Overview

The example demonstrates:

1. **Custom Client Configuration**: Shows how to configure the Socket.IO client with custom transport and parser options
2. **Event Handling**: Implements handlers for `connect`, `disconnect`, and custom events
3. **Acknowledgments**: Demonstrates emit with acknowledgment callbacks
4. **Timeouts**: Shows how to handle timeouts for server responses
5. **Continuous Communication**: Simulates periodic data transmission to the server

### Key Components

- **Engine.IO Client**: Configured with WebSocket transport
- **Custom Parser**: Uses jsoniter-based parser for improved performance
- **Event Emitters**: Examples of different emit patterns including direct values, Event structs, and variadic arguments

### Example Events

The client demonstrates several event patterns:

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

// Periodic events
client.Emit("get_square", number)
client.Emit("get_sum", numbers...)
```

## Configuration

The example connects to a Socket.IO server at `http://127.0.0.1:3001`. To connect to a different server, modify the URL in the client configuration:

```go
eioClient, err := engineio_v4_client.NewClient(
    engineio_v4_client.WithRawURL("http://your-server:port/socket.io/"),
    // ... other options
)
```

## Dependencies

- [go.socket.io](https://github.com/maldikhan/go.socket.io) - Socket.IO v5 client library for Go
- [go.socket.io-parser.jsoniter](https://github.com/maldikhan/go.socket.io-parser.jsoniter) - High-performance JSON parser for Socket.IO
- [zap](https://github.com/uber-go/zap) - Structured logging library

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.