// Script to migrate all existing prompts from TypeScript to JSON
const fs = require('fs');
const path = require('path');

// Paths
const dataDir = path.join(process.cwd(), 'data');
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

// Helper to sanitize a string for use as a filename
function sanitizeFilename(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_') // Replace non-alphanumeric with underscores
    .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
}

// Function to manually parse TypeScript files and extract prompt objects
function extractPrompts(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Get the export line
    let exportLine;
    if (filePath.includes('prompts.ts')) {
      exportLine = 'export const promptsData: Prompt[] = [';
    } else if (filePath.includes('agent-prompts.ts')) {
      exportLine = 'export const agentPrompts: Prompt[] = [';
    } else if (filePath.includes('trading-prompts.ts')) {
      exportLine = 'export const tradingPrompts: Prompt[] = [';
    } else {
      console.error(`Unexpected file format: ${filePath}`);
      return [];
    }
    
    // Split by object entries (starts with { id:)
    const content = fileContent.substring(
      fileContent.indexOf(exportLine) + exportLine.length,
      fileContent.lastIndexOf(']')
    );
    
    // Use regex to split by object starts - this is a more robust approach
    const objectsText = content.split(/^\s*{\s*id:/m);
    
    const prompts = [];
    
    // Skip the first element which is empty
    for (let i = 1; i < objectsText.length; i++) {
      let objectText = '{id:' + objectsText[i];
      
      // Find the end of this object
      let braceCount = 0;
      let endIndex = 0;
      
      for (let j = 0; j < objectText.length; j++) {
        if (objectText[j] === '{') braceCount++;
        if (objectText[j] === '}') braceCount--;
        
        if (braceCount === 0) {
          endIndex = j + 1; // Include the closing brace
          break;
        }
      }
      
      objectText = objectText.substring(0, endIndex).trim();
      
      // Convert to JSON-compatible format
      let jsonText = objectText
        // Change property names to have double quotes
        .replace(/(\w+):/g, '"$1":')
        
        // Convert template literals to double-quoted strings
        .replace(/`([^`]*)`/gs, function(match, p1) {
          // Escape double quotes and escape sequences properly
          return '"' + p1
            .replace(/\\/g, '\\\\') // Replace \ with \\
            .replace(/"/g, '\\"')    // Replace " with \"
            .replace(/\n/g, '\\n')   // Replace newlines
            .replace(/\r/g, '\\r')   // Replace carriage returns
            .replace(/\t/g, '\\t')   // Replace tabs
          + '"';
        })
        
        // Convert single-quoted strings to double-quoted
        .replace(/'([^']*)'/g, '"$1"')
        
        // Remove trailing commas in objects and arrays
        .replace(/,(\s*[\]}])/g, '$1');
      
      try {
        const promptObject = eval('(' + jsonText + ')'); // Use eval as a last resort to parse
        prompts.push(promptObject);
      } catch (error) {
        console.error(`Error parsing object in ${filePath}:`, error);
        console.error('Problem with text:', jsonText);
      }
    }
    
    return prompts;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return [];
  }
}

// Save a prompt as a JSON file
function savePromptAsJson(prompt, directory) {
  const filename = `${prompt.id || sanitizeFilename(prompt.title)}.json`;
  const filePath = path.join(directory, filename);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(prompt, null, 2), 'utf8');
    console.log(`Saved ${filePath}`);
  } catch (error) {
    console.error(`Error saving prompt ${prompt.title}:`, error);
  }
}

// Process each file
function migrateFile(sourceFile, targetDir) {
  console.log(`Processing ${sourceFile}...`);
  const filePath = path.join(dataDir, sourceFile);
  const prompts = extractPrompts(filePath);
  prompts.forEach(prompt => savePromptAsJson(prompt, targetDir));
  console.log(`Migrated ${prompts.length} prompts from ${sourceFile}`);
}

// Migrate all files
migrateFile('prompts.ts', generalDir);
migrateFile('agent-prompts.ts', agentSpecificDir);
migrateFile('trading-prompts.ts', tradingSpecificDir);

console.log('Migration complete!'); 