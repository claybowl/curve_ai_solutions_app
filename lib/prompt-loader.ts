import fs from 'fs';
import path from 'path';
import type { Prompt } from '@/types/prompt';

const promptsDirectory = path.join(process.cwd(), 'prompts');

/**
 * Recursively finds all files with a given extension in a directory.
 */
function findFilesByExtension(startPath: string, filter: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(startPath);
  for (const file of files) {
    const filename = path.join(startPath, file);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      findFilesByExtension(filename, filter, fileList); // Recurse into subdirectories
    } else if (filename.endsWith(filter)) {
      fileList.push(filename);
    }
  }
  return fileList;
}

/**
 * Loads all prompts from JSON files within the prompts directory and its subdirectories.
 */
export function getAllPrompts(): Prompt[] {
  const allPromptFiles = findFilesByExtension(promptsDirectory, '.json');
  const allPrompts = allPromptFiles.map((filePath) => {
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const prompt = JSON.parse(fileContents) as Prompt;
      // Ensure all necessary fields are present, assign defaults, or validate
      // For simplicity, we assume valid Prompt structure for now
      // You might want to add more robust validation here based on the Prompt type
      return prompt;
    } catch (error) {
      console.error(`Error parsing prompt file ${filePath}:`, error);
      return null; // Or throw error, depending on desired handling
    }
  });

  return allPrompts.filter(prompt => prompt !== null) as Prompt[]; // Filter out any nulls from parsing errors
}

/**
 * Extracts all unique categories from the loaded prompts.
 */
export function getAllPromptCategories(): string[] {
  const prompts = getAllPrompts();
  const allCategories = new Set<string>();
  prompts.forEach(prompt => {
    if (prompt.categories && Array.isArray(prompt.categories)) {
      prompt.categories.forEach(category => allCategories.add(category));
    }
  });
  return Array.from(allCategories).sort();
}

// Example of how you might get prompts by a specific category, if needed later
export function getPromptsByCategory(category: string): Prompt[] {
  const allPrompts = getAllPrompts();
  return allPrompts.filter(prompt => prompt.categories?.includes(category));
} 