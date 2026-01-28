#!/usr/bin/env node
/**
 * Reset Database - Drops all tables and starts fresh
 */

const { config } = require('dotenv');
config({ path: '.env.local' });

async function resetDatabase() {
  console.log('🗑️  Resetting database...\n');
  
  try {
    const { neon } = await import('@neondatabase/serverless');
    const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not set');
    }
    
    const sql = neon(databaseUrl);
    
    // Drop all tables in reverse dependency order
    const tables = [
      'schema_migrations',
      'board_room_post_likes',
      'board_room_posts',
      'calendar_connections',
      'consultation_files',
      'consultation_messages',
      'consultation_summaries',
      'n8n_workflow_executions',
      'n8n_workflows',
      'prompt_collection_items',
      'sandbox_sessions',
      'user_engagement_metrics',
      'user_presence',
      'user_tool_usage',
      'video_call_logs',
      'whiteboard_snapshots',
      'ai_tools',
      'analytics_events',
      'assessment_questions',
      'assessment_responses',
      'assessment_results',
      'assessments',
      'blog_posts',
      'consultation_requests',
      'consultations',
      'notification_templates',
      'prompt_categories',
      'prompts',
      'tool_categories',
      'user_notifications',
      'user_prompt_collections',
      'assessment_categories',
      'profiles',
      'users'
    ];
    
    for (const table of tables) {
      try {
        await sql.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
        console.log(`  ✅ Dropped ${table}`);
      } catch (err) {
        console.log(`  ○ ${table} (did not exist)`);
      }
    }
    
    console.log('\n✅ Database reset complete!\n');
    console.log('Run: node scripts/run-migrations.js\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetDatabase();
