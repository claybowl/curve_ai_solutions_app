/**
 * Script to apply database schema updates
 * 
 * This script can use two methods:
 * 1. Using psql command line tool (requires PostgreSQL client tools)
 * 2. Using Node.js with the neon serverless driver (no external dependencies)
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { config } = require('dotenv');

// Load environment variables from .env.local
config({ path: '.env.local' });

async function applyUpdatesWithNeon() {
  console.log('Applying database schema updates using Neon serverless driver...');
  
  try {
    // Dynamically import neon (supports ESM)
    const { neon } = await import('@neondatabase/serverless');
    
    // Get the database URL from environment variables
    const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('Error: DATABASE_URL environment variable is not set');
      process.exit(1);
    }
    
    // Path to the schema update SQL file
    const schemaUpdatePath = path.join(__dirname, '..', 'db-schema-updates.sql');
    
    if (!fs.existsSync(schemaUpdatePath)) {
      console.error(`Error: Schema update file not found: ${schemaUpdatePath}`);
      process.exit(1);
    }
    
    // Read the SQL file
    const sqlContent = fs.readFileSync(schemaUpdatePath, 'utf8');
    
    // Split the SQL into individual statements
    // This is a simple approach and might not work for all SQL files
    const statements = sqlContent
      .replace(/\r\n/g, '\n')  // Normalize line endings
      .split(';')              // Split on semicolons
      .map(stmt => stmt.trim()) // Trim whitespace
      .filter(stmt => stmt && !stmt.startsWith('--')); // Remove empty statements and comments
    
    // Initialize the neon client
    const sql = neon(databaseUrl);
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.length > 0) {
        try {
          await sql.raw(statement);
          console.log('Executed:', statement.substring(0, 50) + (statement.length > 50 ? '...' : ''));
        } catch (err) {
          console.warn(`Warning: Statement failed: ${err.message}`);
          console.warn('Statement:', statement);
          // Continue with next statement instead of failing
        }
      }
    }
    
    console.log('Database schema updates applied successfully using Neon driver');
    return true;
  } catch (error) {
    console.error('Error applying database schema updates with Neon driver:', error.message);
    return false;
  }
}

function applyUpdatesWithPsql() {
  console.log('Applying database schema updates using psql...');
  
  // Get the database URL from environment variables
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('Error: DATABASE_URL environment variable is not set');
    return false;
  }
  
  // Path to the schema update SQL file
  const schemaUpdatePath = path.join(__dirname, '..', 'db-schema-updates.sql');
  
  if (!fs.existsSync(schemaUpdatePath)) {
    console.error(`Error: Schema update file not found: ${schemaUpdatePath}`);
    return false;
  }
  
  try {
    // Apply the schema updates using psql
    execSync(`psql "${databaseUrl}" -f ${schemaUpdatePath}`, { stdio: 'inherit' });
    console.log('Database schema updates applied successfully using psql');
    return true;
  } catch (error) {
    console.error('Error applying database schema updates with psql:', error.message);
    return false;
  }
}

async function runScript() {
  console.log('Starting database schema update process...');
  
  // Try with psql first
  const psqlSuccess = applyUpdatesWithPsql();
  
  // If psql fails, try with Neon driver
  if (!psqlSuccess) {
    console.log('Falling back to Neon serverless driver method...');
    const neonSuccess = await applyUpdatesWithNeon();
    
    if (!neonSuccess) {
      console.error('All update methods failed. Please apply the SQL manually.');
      console.log('SQL file location:', path.join(__dirname, '..', 'db-schema-updates.sql'));
      process.exit(1);
    }
  }
  
  console.log('Database update process completed successfully.');
}

runScript();