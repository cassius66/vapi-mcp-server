# Vapi MCP Server

The Vapi [Model Context Protocol](https://modelcontextprotocol.com/) server allows you to integrate with Vapi APIs through function calling.

## Setup

To run the Vapi MCP server using npx, use the following command:

```bash
# To set up all available tools
export VAPI_TOKEN=your_vapi_token

npx -y @vapi-ai/mcp-server
```

### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`. See [here](https://modelcontextprotocol.io/quickstart/user) for more details.

```

{
  "mcpServers": {
    "vapi-mcp-server": {
      "command": "npx",
      "args": [
          "-y",
          "@vapi-ai/mcp-server"
      ],
      "env": {
        "VAPI_TOKEN": "<your_vapi_token>"
      }
    }
  }
}

```

## Development

```bash
# Install dependencies
npm install

# Build the server
npm run build
```

```bash
# Run the server in development mode with hot reloading
npm run dev
```

## Testing

The project has two types of tests:

### Unit Tests

Unit tests use mocks to test the MCP server without making actual API calls to Vapi.

```bash
# Run unit tests
npm run test:unit
```

### End-to-End Tests

E2E tests run the full MCP server with actual API calls to Vapi.

```bash
# Set your Vapi API token
export VAPI_TOKEN=your_token_here

# Run E2E tests
npm run test:e2e
```

Note: E2E tests require a valid Vapi API token to be set in the environment.

## Running All Tests

To run all tests at once:

```bash
npm test
```
