/**
 * Database Migration Runner
 * 
 * Applies all SQL migrations in the correct order:
 * 1. Base schema (profiles table)
 * 2. Production schema (main tables)
 * 3. Feature migrations (consultation platform, n8n, etc.)
 * 
 * Usage:
 *   node scripts/run-migrations.js           # Run all pending migrations
 *   node scripts/run-migrations.js --status  # Check migration status
 *   node scripts/run-migrations.js --reset   # Reset and re-run all
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { config } = require('dotenv');

// Load environment variables
config({ path: '.env.local' });

// Migration files in dependency order
const MIGRATION_ORDER = [
  // 1. Base schema (must be first - creates users and profiles tables)
  'supabase/migrations/000_base_schema.sql',
  
  // 2. Production schema (creates all main tables) - Neon-compatible version
  'supabase/migrations/001_production_schema.sql',
  
  // 3. Additional migrations (depend on base tables) - Neon-compatible versions
  'supabase/migrations/002_n8n_workflows.sql',
  'supabase/migrations/003_consultation_platform.sql',
  
  // 4. Roadmap tables
  'supabase/migrations/004_roadmap_tables.sql',
];

// Tracking table creation SQL
const CREATE_TRACKING_TABLE = `
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    filename TEXT UNIQUE NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checksum TEXT
);
`;

async function getNeonClient() {
  const { neon } = await import('@neondatabase/serverless');
  const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  return neon(databaseUrl);
}

async function ensureTrackingTable(sql) {
  console.log('Ensuring migration tracking table exists...');
  await sql.query(CREATE_TRACKING_TABLE);
}

async function getAppliedMigrations(sql) {
  try {
    const result = await sql.query('SELECT filename FROM schema_migrations ORDER BY applied_at');
    return new Set(result.map(row => row.filename));
  } catch (error) {
    // Table might not exist yet
    return new Set();
  }
}

async function recordMigration(sql, filename, content) {
  const crypto = require('crypto');
  const checksum = crypto.createHash('md5').update(content).digest('hex');
  
  await sql.query(
    'INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2) ON CONFLICT (filename) DO UPDATE SET checksum = $2',
    [filename, checksum]
  );
}

async function applyMigration(sql, filepath) {
  const fullPath = path.join(process.cwd(), filepath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Migration file not found: ${filepath}`);
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  
  console.log(`\n📄 Applying: ${filepath}`);
  console.log('=' .repeat(60));
  
  try {
    // Split SQL into statements (handle $$ blocks for functions)
    const statements = splitSqlStatements(content);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql.query(statement);
          process.stdout.write('✓');
        } catch (err) {
          // Check if it's a "already exists" error
          if (err.message && (
            err.message.includes('already exists') ||
            err.message.includes('duplicate key') ||
            err.message.includes('already a member')
          )) {
            process.stdout.write('○'); // Skipped (already exists)
          } else {
            console.error('\n❌ Error:', err.message);
            console.error('Statement:', statement.substring(0, 200));
            throw err;
          }
        }
      }
    }
    
    await recordMigration(sql, filepath, content);
    console.log('\n✅ Success');
    return true;
    
  } catch (error) {
    console.error(`\n❌ Failed to apply ${filepath}`);
    console.error(error.message);
    return false;
  }
}

function splitSqlStatements(sql) {
  const statements = [];
  let currentStatement = '';
  let inDollarQuote = false;
  let dollarQuoteTag = '';
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1];
    
    // Check for dollar quote start
    if (char === '$' && !inDollarQuote) {
      const match = sql.substring(i).match(/^\$([a-zA-Z_]*)\$/);
      if (match) {
        inDollarQuote = true;
        dollarQuoteTag = match[0];
        currentStatement += match[0];
        i += match[0].length - 1;
        continue;
      }
    }
    
    // Check for dollar quote end
    if (inDollarQuote && char === '$') {
      const potentialEnd = sql.substring(i, i + dollarQuoteTag.length);
      if (potentialEnd === dollarQuoteTag) {
        inDollarQuote = false;
        currentStatement += dollarQuoteTag;
        i += dollarQuoteTag.length - 1;
        dollarQuoteTag = '';
        continue;
      }
    }
    
    // Check for statement end (only outside dollar quotes)
    if (!inDollarQuote && char === ';') {
      currentStatement += char;
      statements.push(currentStatement.trim());
      currentStatement = '';
      continue;
    }
    
    currentStatement += char;
  }
  
  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  return statements;
}

async function checkStatus(sql) {
  console.log('\n📊 Migration Status');
  console.log('=' .repeat(60));
  
  const applied = await getAppliedMigrations(sql);
  
  for (const migration of MIGRATION_ORDER) {
    const isApplied = applied.has(migration);
    const icon = isApplied ? '✅' : '⬜';
    const status = isApplied ? 'applied' : 'pending';
    console.log(`${icon} ${migration} (${status})`);
  }
  
  console.log('\n');
}

async function resetMigrations(sql) {
  console.log('\n⚠️  Resetting all migrations...');
  console.log('This will clear the migration tracking table.\n');
  
  try {
    await sql.query('DROP TABLE IF EXISTS schema_migrations CASCADE');
    console.log('✅ Migration tracking table cleared');
    console.log('Run again to re-apply all migrations\n');
  } catch (error) {
    console.error('❌ Error resetting migrations:', error.message);
  }
}

async function runMigrations() {
  console.log('\n🚀 Database Migration Runner');
  console.log('=' .repeat(60));
  
  try {
    const sql = await getNeonClient();
    
    // Handle command line arguments
    const args = process.argv.slice(2);
    
    if (args.includes('--status')) {
      await checkStatus(sql);
      return;
    }
    
    if (args.includes('--reset')) {
      await resetMigrations(sql);
      return;
    }
    
    // Ensure tracking table exists
    await ensureTrackingTable(sql);
    
    // Get list of already applied migrations
    const applied = await getAppliedMigrations(sql);
    
    console.log(`Found ${applied.size} already applied migrations\n`);
    
    // Apply pending migrations
    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;
    
    for (const migration of MIGRATION_ORDER) {
      if (applied.has(migration)) {
        console.log(`⏭️  Skipping (already applied): ${migration}`);
        skipCount++;
        continue;
      }
      
      const success = await applyMigration(sql, migration);
      if (success) {
        successCount++;
      } else {
        failCount++;
        if (failCount >= 3) {
          console.error('\n❌ Too many failures. Stopping migration process.');
          process.exit(1);
        }
      }
    }
    
    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📋 Migration Summary');
    console.log('=' .repeat(60));
    console.log(`✅ Applied: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`❌ Failed:  ${failCount}`);
    console.log('');
    
    if (failCount === 0) {
      console.log('🎉 All migrations completed successfully!\n');
      
      // Verify tables exist
      console.log('🔍 Verifying tables...');
      const tables = [
        'profiles',
        'assessments',
        'consultations',
        'ai_tools',
        'prompts',
        'user_notifications',
        'blog_posts'
      ];
      
      for (const table of tables) {
        try {
          const result = await sql.query(`SELECT 1 FROM ${table} LIMIT 0`);
          console.log(`  ✅ ${table}`);
        } catch (err) {
          console.log(`  ❌ ${table} - ${err.message}`);
        }
      }
      console.log('');
    } else {
      console.log('⚠️  Some migrations failed. Check errors above.\n');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run migrations
runMigrations();
