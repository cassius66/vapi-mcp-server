# Vapi MCP Server

The Vapi [Model Context Protocol](https://modelcontextprotocol.com/) server allows you to integrate with Vapi APIs through function calling.

## Claude Desktop Setup

1. Open `Claude Desktop` and press `CMD + ,` to go to `Settings`.
2. Click on the `Developer` tab.
3. Click on the `Edit Config` button.
4. This will open the `claude_desktop_config.json` file in your file explorer.
5. Get your Vapi API key from the Vapi dashboard (<https://dashboard.vapi.ai/org/api-keys>).
6. Add the following to your `claude_desktop_config.json` file. See [here](https://modelcontextprotocol.io/quickstart/user) for more details.
7. Restart the Claude Desktop after editing the config file.

```json
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

### Example Usage with Claude Desktop

1. Create or import a phone number using the Vapi dashboard (<https://dashboard.vapi.ai/phone-numbers>).
2. Create a new assistant using the existing 'Appointment Scheduler' template in the Vapi dashboard (<https://dashboard.vapi.ai/assistants>).
3. Make sure to configure Claude Desktop to use the Vapi MCP server and restart the Claude Desktop app.
4. Ask Claude with the following message:

```md
I wanna schedule an appointment, can you connect me with Riley assistant using my phone number +1234567890?
```

## Remote SSE Connection

To connect to Vapi's MCP server via Server-Sent Events (SSE) Transport:

- Connect to `https://mcp.vapi.ai/sse` from any MCP client using SSE Transport
- Include your Vapi API key as a bearer token in the request headers
- Example header: `Authorization: Bearer your_vapi_api_key_here`

This connection allows you to access Vapi's functionality remotely without running a local server.

## Development

```bash
# Install dependencies
npm install

# Build the server
npm run build
```

Update your `claude_desktop_config.json` to use the local server.

```json
{
  "mcpServers": {
    "vapi-local": {
      "command": "node",
      "args": [
        "<path_to_vapi_mcp_server>/dist/index.js"
      ],
      "env": {
        "VAPI_TOKEN": "<your_vapi_token>"
      }
    },
  }
}
```

### Testing

The project has two types of tests:

#### Unit Tests

Unit tests use mocks to test the MCP server without making actual API calls to Vapi.

```bash
# Run unit tests
npm run test:unit
```

#### End-to-End Tests

E2E tests run the full MCP server with actual API calls to Vapi.

```bash
# Set your Vapi API token
export VAPI_TOKEN=your_token_here

# Run E2E tests
npm run test:e2e
```

Note: E2E tests require a valid Vapi API token to be set in the environment.

#### Running All Tests

To run all tests at once:

```bash
npm test
```

## References

- [VAPI Remote MCP Server](https://mcp.vapi.ai/)
- [VAPI MCP Tool](https://docs.vapi.ai/tools/mcp)
- [Model Context Protocol](https://modelcontextprotocol.com/)
- [Claude Desktop](https://modelcontextprotocol.io/quickstart/user)
