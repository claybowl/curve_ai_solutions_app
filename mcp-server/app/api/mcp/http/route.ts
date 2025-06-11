import { createMcpAdapter } from '@vercel/mcp-adapter';
import { NextRequest } from 'next/server';

// Define your MCP tools - keep in sync with the SSE version
const tools = [
  {
    name: 'curveai_search',
    description: 'Search for information in the Curve AI Solutions database',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query to use',
        },
      },
      required: ['query'],
    },
    function: async ({ query }: { query: string }) => {
      // Implement the actual search logic here
      return {
        results: [
          {
            title: `Result for ${query}`,
            description: `This is a sample result for the query: ${query}`,
          },
        ],
      };
    },
  },
  {
    name: 'curveai_get_tools',
    description: 'Get a list of available AI tools from Curve AI Solutions',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter tools by category (optional)',
        },
      },
    },
    function: async ({ category }: { category?: string }) => {
      // Implement the actual tool listing logic here
      return {
        tools: [
          {
            name: 'AI Prompt Generator',
            category: 'Productivity',
            description: 'Generate effective prompts for AI systems',
          },
          {
            name: 'Business Process Analyzer',
            category: 'Analytics',
            description: 'Analyze and optimize business processes',
          },
        ].filter(tool => !category || tool.category === category),
      };
    },
  },
];

// Create the MCP adapter with HTTP transport
const { GET, POST } = createMcpAdapter({
  tools,
  transport: 'http',
});

export { GET, POST };