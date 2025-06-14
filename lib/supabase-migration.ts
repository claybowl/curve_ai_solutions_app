/**
 * Functions for migrating from NextAuth users to Supabase Auth users
 */
import { supabase } from './supabase';
import { supabaseAdmin } from './supabase-admin';
import { sql } from './db';
import { UserMetadata } from './supabase';

interface MigrationUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  role: string;
}

/**
 * Updates foreign key references from old database user ID to Supabase UUID
 */
async function updateForeignKeyReferences(dbUserId: number, supabaseUserId: string) {
  try {
    console.log(`Updating foreign key references from DB ID ${dbUserId} to Supabase UUID ${supabaseUserId}`);

    // Start a transaction for all updates
    await sql`BEGIN`;

    // Update consultation_requests
    await sql`
      UPDATE consultation_requests 
      SET assigned_to_uuid = ${supabaseUserId}
      WHERE assigned_to = ${dbUserId}
    `;

    // Update ai_assessments
    await sql`
      UPDATE ai_assessments 
      SET user_uuid = ${supabaseUserId}
      WHERE user_id = ${dbUserId}
    `;

    // Update notes
    await sql`
      UPDATE notes 
      SET user_uuid = ${supabaseUserId}
      WHERE user_id = ${dbUserId}
    `;

    // Update ai_tools
    await sql`
      UPDATE ai_tools 
      SET created_by_uuid = ${supabaseUserId}
      WHERE created_by = ${dbUserId}
    `;

    // Update blog_posts
    await sql`
      UPDATE blog_posts 
      SET author_uuid = ${supabaseUserId}
      WHERE author_id = ${dbUserId}
    `;

    // Update prompts
    await sql`
      UPDATE prompts 
      SET author_uuid = ${supabaseUserId}
      WHERE author_id = ${dbUserId}
    `;

    // Update user_saved_prompts
    await sql`
      UPDATE user_saved_prompts 
      SET user_uuid = ${supabaseUserId}
      WHERE user_id = ${dbUserId}
    `;

    // Update user_roles
    await sql`
      UPDATE user_roles 
      SET user_uuid = ${supabaseUserId}
      WHERE user_id = ${dbUserId}
    `;

    // Update user_permissions
    await sql`
      UPDATE user_permissions 
      SET user_uuid = ${supabaseUserId}
      WHERE user_id = ${dbUserId}
    `;

    // Commit the transaction
    await sql`COMMIT`;

    return true;
  } catch (error) {
    // Rollback on error
    await sql`ROLLBACK`;
    console.error('Error updating foreign key references:', error);
    throw error;
  }
}

/**
 * Migrates a single user from the database to Supabase Auth
 */
export async function migrateUserToSupabase(user: MigrationUser, password: string): Promise<string | null> {
  try {
    console.log(`Migrating user ${user.email} to Supabase`);

    // Check if user already exists in Supabase
    const { data: existingUsers } = await supabaseAdmin().auth.admin.listUsers({
      filter: {
        email: user.email
      }
    });

    if (existingUsers && existingUsers.users.length > 0) {
      console.log(`User ${user.email} already exists in Supabase with ID ${existingUsers.users[0].id}`);
      
      // Update user metadata if needed
      await supabaseAdmin().auth.admin.updateUserById(
        existingUsers.users[0].id,
        {
          user_metadata: {
            firstName: user.firstName,
            lastName: user.lastName,
            companyName: user.companyName,
            role: user.role
          } as UserMetadata
        }
      );

      // Update foreign key references
      await updateForeignKeyReferences(user.id, existingUsers.users[0].id);
      
      return existingUsers.users[0].id;
    }

    // Create new user in Supabase
    const { data, error } = await supabaseAdmin().auth.admin.createUser({
      email: user.email,
      password,
      email_confirm: true,
      user_metadata: {
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        role: user.role
      } as UserMetadata
    });

    if (error) {
      console.error(`Error creating user ${user.email} in Supabase:`, error);
      return null;
    }

    if (!data.user) {
      console.error(`Failed to create user ${user.email} in Supabase`);
      return null;
    }

    // Update foreign key references
    await updateForeignKeyReferences(user.id, data.user.id);

    return data.user.id;
  } catch (error) {
    console.error(`Error migrating user ${user.email}:`, error);
    return null;
  }
}

/**
 * Gets all users from the database for migration
 */
export async function getUsersForMigration(): Promise<MigrationUser[]> {
  try {
    const users = await sql`
      SELECT 
        id, email, first_name as "firstName", last_name as "lastName", 
        company_name as "companyName", role
      FROM users
      ORDER BY id
    `;
    
    return users;
  } catch (error) {
    console.error('Error fetching users for migration:', error);
    return [];
  }
}

/**
 * Add UUID columns to relevant tables for Supabase integration
 */
export async function addUuidColumns() {
  try {
    console.log('Adding UUID columns to database tables...');
    
    await sql`
      -- Add UUID columns to all relevant tables
      
      -- consultation_requests
      ALTER TABLE consultation_requests 
      ADD COLUMN IF NOT EXISTS assigned_to_uuid UUID;
      
      -- ai_assessments
      ALTER TABLE ai_assessments 
      ADD COLUMN IF NOT EXISTS user_uuid UUID;
      
      -- notes
      ALTER TABLE notes 
      ADD COLUMN IF NOT EXISTS user_uuid UUID;
      
      -- ai_tools
      ALTER TABLE ai_tools 
      ADD COLUMN IF NOT EXISTS created_by_uuid UUID;
      
      -- blog_posts
      ALTER TABLE blog_posts 
      ADD COLUMN IF NOT EXISTS author_uuid UUID;
      
      -- prompts
      ALTER TABLE prompts 
      ADD COLUMN IF NOT EXISTS author_uuid UUID;
      
      -- user_saved_prompts
      ALTER TABLE user_saved_prompts 
      ADD COLUMN IF NOT EXISTS user_uuid UUID;
      
      -- user_roles
      ALTER TABLE user_roles 
      ADD COLUMN IF NOT EXISTS user_uuid UUID;
      
      -- user_permissions
      ALTER TABLE user_permissions 
      ADD COLUMN IF NOT EXISTS user_uuid UUID;
      
      -- Add new indexes
      CREATE INDEX IF NOT EXISTS consultation_requests_assigned_to_uuid_idx 
      ON consultation_requests(assigned_to_uuid);
      
      CREATE INDEX IF NOT EXISTS ai_assessments_user_uuid_idx 
      ON ai_assessments(user_uuid);
      
      CREATE INDEX IF NOT EXISTS notes_user_uuid_idx 
      ON notes(user_uuid);
      
      CREATE INDEX IF NOT EXISTS ai_tools_created_by_uuid_idx 
      ON ai_tools(created_by_uuid);
      
      CREATE INDEX IF NOT EXISTS blog_posts_author_uuid_idx 
      ON blog_posts(author_uuid);
      
      CREATE INDEX IF NOT EXISTS prompts_author_uuid_idx 
      ON prompts(author_uuid);
      
      CREATE INDEX IF NOT EXISTS user_saved_prompts_user_uuid_idx 
      ON user_saved_prompts(user_uuid);
      
      CREATE INDEX IF NOT EXISTS user_roles_user_uuid_idx 
      ON user_roles(user_uuid);
      
      CREATE INDEX IF NOT EXISTS user_permissions_user_uuid_idx 
      ON user_permissions(user_uuid);
    `;
    
    console.log('UUID columns added successfully');
    return true;
  } catch (error) {
    console.error('Error adding UUID columns:', error);
    throw error;
  }
}

/**
 * Run a complete migration from NextAuth to Supabase Auth
 */
export async function runMigration(defaultPassword: string = 'ChangeMe123!') {
  try {
    console.log('Starting migration from NextAuth to Supabase Auth...');
    
    // Step 1: Add UUID columns to all relevant tables
    await addUuidColumns();
    
    // Step 2: Get all users from the database
    const users = await getUsersForMigration();
    console.log(`Found ${users.length} users to migrate`);
    
    // Step 3: Migrate each user to Supabase Auth
    const results = [];
    for (const user of users) {
      const supabaseUserId = await migrateUserToSupabase(user, defaultPassword);
      results.push({
        dbId: user.id,
        email: user.email,
        supabaseUserId,
        success: !!supabaseUserId
      });
    }
    
    // Step 4: Return migration results
    return {
      totalUsers: users.length,
      migratedUsers: results.filter(r => r.success).length,
      failedUsers: results.filter(r => !r.success).length,
      details: results
    };
  } catch (error) {
    console.error('Error running migration:', error);
    throw error;
  }
}