# Curve AI Solutions MCP Server

This is a Model Context Protocol (MCP) server for Curve AI Solutions, designed to be deployed to Vercel.

## Features

- SSE and HTTP transport options
- Custom MCP tools for Curve AI Solutions
- Ready for deployment on Vercel

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Deployment to Vercel

1. Push this repository to GitHub
2. Connect to Vercel and import the repository
3. Configure environment variables:
   - For SSE transport: Add `REDIS_URL` environment variable with your Redis connection string
4. Deploy the project

## Integration with Claude

After deployment, update your Claude configuration to use this MCP server:

```json
{
  "mcpServers": {
    "curveai": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://your-deployed-url.vercel.app/api/mcp/sse"
      ]
    }
  }
}
```

For a production environment:

```json
{
  "production": {
    "mcpServerUrl": "https://your-deployed-url.vercel.app/api/mcp"
  }
}
```

## Available Tools

- `curveai_search`: Search for information in the Curve AI Solutions database
- `curveai_get_tools`: Get a list of available AI tools from Curve AI Solutions