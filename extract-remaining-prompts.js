// Script to manually extract the remaining problematic prompts
const fs = require('fs');
const path = require('path');

// Paths
const promptsDir = path.join(process.cwd(), 'prompts');

// Ensure directories exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Create subdirectories
const generalDir = path.join(promptsDir, 'general');
const agentSpecificDir = path.join(promptsDir, 'agent_specific');
const tradingSpecificDir = path.join(promptsDir, 'trading_specific');

ensureDirectoryExists(generalDir);
ensureDirectoryExists(agentSpecificDir);
ensureDirectoryExists(tradingSpecificDir);

// Manually create the problematic prompts - Code Refactoring Advisor
const codeRefactoringAdvisor = {
  id: "3",
  title: "Code Refactoring Advisor",
  description: "Analyze code snippets and provide suggestions for improving code quality, readability, and efficiency.",
  content: `As a senior software engineer specializing in code quality, analyze the following code snippet and provide refactoring recommendations:

\`\`\`
[PASTE CODE HERE]
\`\`\`

Please provide your analysis in the following format:

1. Code Quality Assessment:
   - Overall evaluation
   - Potential bugs or edge cases
   - Performance concerns

2. Refactoring Recommendations:
   - Structural improvements
   - Readability enhancements
   - Performance optimizations
   - Design pattern suggestions

3. Refactored Code:
   - Provide a clean, refactored version of the code with comments explaining key changes

4. Additional Best Practices:
   - Testing suggestions
   - Documentation recommendations
   - Maintenance considerations`,
  categories: ["software development", "code quality", "programming"],
  rating: 88,
  analysis: "This prompt provides a clear structure for code review and refactoring, ensuring comprehensive feedback that addresses multiple aspects of code quality.",
  strengths: [
    "Structured format ensures comprehensive analysis",
    "Requests both feedback and concrete solutions",
    "Includes considerations beyond just the code itself",
    "Adaptable to different programming languages"
  ],
  weaknesses: [
    "Could benefit from language-specific variations",
    "Might need adjustment for very large code snippets"
  ],
  instructions: "Replace [PASTE CODE HERE] with the code snippet you want to refactor. Specify the programming language if it's not obvious from the syntax.",
  createdBy: "Development Team",
  createdAt: "2023-08-20",
  updatedAt: "2024-01-15"
};

// Schema Design Assistant
const schemaDesignAssistant = {
  id: "schema-design-assistant",
  title: "Schema Design Assistant",
  description: "Generates complete ZenStack/Prisma schemas with appropriate models, relationships, and access policies based on feature descriptions.",
  categories: ["Database", "Development", "Security"],
  rating: 92,
  content: `You are a Schema Design Assistant specialized in ZenStack and Prisma models.

Based on this feature description: "{feature_description}"

Please:
1. Generate a complete ZenStack schema (.zmodel) with appropriate models, fields, relationships, and access policies
2. Include necessary enums and custom types
3. Implement proper validation rules and access controls based on user roles
4. Suggest indexes for optimizing common queries
5. Document each model with clear comments explaining its purpose and relationships

Consider our existing authentication system using JWT and how new models will integrate with our User model.`,
  analysis: "This prompt leverages the project's database structure to generate properly formatted ZenStack schemas with appropriate access controls and validation. The focus on integration with existing auth systems makes the output immediately usable.",
  strengths: [
    "Domain-specific to the project's data modeling approach",
    "Incorporates security and validation best practices",
    "Considers query performance through indexing",
    "Ensures proper documentation of data models"
  ]
};

// Market Data Integration
const marketDataIntegration = {
  id: "market-data-integration",
  title: "Market Data Integration",
  description: "Expand market data collection capabilities to enable more sophisticated trading strategies with access to deeper market data.",
  categories: ["algorithmic trading", "data engineering", "finance"],
  rating: 85,
  content: `Extend your market data ingestion system to handle additional data types (such as [DATA_TYPE]) from [DATA_SOURCE]. Implement methods to request this data, process the incoming data stream, and store it in your database with appropriate schema modifications. Include error handling for connection issues and data validation.`,
  analysis: "Quality and breadth of market data are foundational to algorithmic trading success. This prompt addresses the complete workflow of integrating new data sources: acquisition, processing, storage, and error handling.",
  strengths: [
    "Addresses the complete data integration workflow",
    "Enables more sophisticated strategy development",
    "Includes error handling and validation",
    "Provides potential competitive advantages through unique signals"
  ],
  example: `Extend your market data ingestion system to handle additional data types (such as order book depth data) from your exchange API. Implement methods to request this data, process the incoming data stream, and store it in your database with appropriate schema modifications. Include error handling for connection issues and data validation to ensure data integrity.`,
  createdBy: "Trading Systems Team",
  createdAt: "2024-01-22",
  updatedAt: "2024-03-15"
};

// Save the problematic prompts
fs.writeFileSync(
  path.join(generalDir, '3.json'), 
  JSON.stringify(codeRefactoringAdvisor, null, 2), 
  'utf8'
);
console.log('Saved Code Refactoring Advisor');

fs.writeFileSync(
  path.join(agentSpecificDir, 'schema-design-assistant.json'), 
  JSON.stringify(schemaDesignAssistant, null, 2), 
  'utf8'
);
console.log('Saved Schema Design Assistant');

fs.writeFileSync(
  path.join(tradingSpecificDir, 'market-data-integration.json'), 
  JSON.stringify(marketDataIntegration, null, 2), 
  'utf8'
);
console.log('Saved Market Data Integration');

console.log('All problematic prompts have been manually migrated!'); 