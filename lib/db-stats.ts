/**
 * Database functions for analytics and statistics
 */
import { sql } from './db';

interface AdminDashboardStats {
  userCount: number;
  assessmentCount: number;
  pendingAssessments: number;
  completedAssessments: number;
  toolCount: number;
  activeToolCount: number;
  roleCount: number;
  promptCount: number;
  consultationCount: number;
  pendingConsultations: number;
}

interface UserGrowthDataPoint {
  date: string;
  count: number;
}

interface ActivityDataPoint {
  category: string;
  count: number;
}

interface CategoryBreakdown {
  name: string;
  count: number;
  percentage: number;
}

/**
 * Get overall stats for admin dashboard
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  try {
    // Default values
    const stats: AdminDashboardStats = {
      userCount: 0,
      assessmentCount: 0,
      pendingAssessments: 0,
      completedAssessments: 0,
      toolCount: 0,
      activeToolCount: 0,
      roleCount: 0,
      promptCount: 0,
      consultationCount: 0,
      pendingConsultations: 0
    };

    // Get user count
    try {
      const userResult = await sql.query('SELECT COUNT(*) as count FROM users');
      stats.userCount = parseInt(userResult[0].count) || 0;
    } catch (err) {
      console.error('Error fetching user count:', err);
    }

    // Get assessment counts
    try {
      const assessmentResult = await sql.query(
        'SELECT COUNT(*) as count FROM ai_assessments'
      );
      stats.assessmentCount = parseInt(assessmentResult[0].count) || 0;

      const pendingResult = await sql.query(
        'SELECT COUNT(*) as count FROM ai_assessments WHERE status = $1',
        ['pending']
      );
      stats.pendingAssessments = parseInt(pendingResult[0].count) || 0;

      const completedResult = await sql.query(
        'SELECT COUNT(*) as count FROM ai_assessments WHERE status = $1',
        ['completed']
      );
      stats.completedAssessments = parseInt(completedResult[0].count) || 0;
    } catch (err) {
      console.error('Error fetching assessment counts:', err);
    }

    // Get tool counts
    try {
      const toolResult = await sql.query('SELECT COUNT(*) as count FROM ai_tools');
      stats.toolCount = parseInt(toolResult[0].count) || 0;

      const activeToolResult = await sql.query(
        'SELECT COUNT(*) as count FROM ai_tools WHERE is_active = true'
      );
      stats.activeToolCount = parseInt(activeToolResult[0].count) || 0;
    } catch (err) {
      console.error('Error fetching tool counts:', err);
    }

    // Get role count
    try {
      const roleResult = await sql.query('SELECT COUNT(*) as count FROM roles');
      stats.roleCount = parseInt(roleResult[0].count) || 0;
    } catch (err) {
      console.error('Error fetching role count:', err);
    }


    // Get prompt count
    try {
      const promptResult = await sql.query('SELECT COUNT(*) as count FROM prompts');
      stats.promptCount = parseInt(promptResult[0].count) || 0;
    } catch (err) {
      console.error('Error fetching prompt count:', err);
    }

    // Get consultation counts
    try {
      const consultationResult = await sql.query(
        'SELECT COUNT(*) as count FROM consultations'
      );
      stats.consultationCount = parseInt(consultationResult[0].count) || 0;

      const pendingConsResult = await sql.query(
        'SELECT COUNT(*) as count FROM consultations WHERE status = $1',
        ['pending']
      );
      stats.pendingConsultations = parseInt(pendingConsResult[0].count) || 0;
    } catch (err) {
      console.error('Error fetching consultation counts:', err);
    }

    return stats;
  } catch (error) {
    console.error('Error in getAdminDashboardStats:', error);
    throw error;
  }
}

/**
 * Get user growth over time (last 30 days)
 */
export async function getUserGrowthData(): Promise<UserGrowthDataPoint[]> {
  try {
    const query = `
      SELECT 
        date_trunc('day', created_at) as date,
        count(*) as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '30 day'
      GROUP BY date
      ORDER BY date
    `;

    const result = await sql.query(query);
    return result.map(row => ({
      date: row.date.toISOString().split('T')[0],
      count: parseInt(row.count)
    }));
  } catch (error) {
    console.error('Error in getUserGrowthData:', error);
    throw error;
  }
}

/**
 * Get recent activity counts by category
 */
export async function getRecentActivityData(): Promise<ActivityDataPoint[]> {
  try {
    // Initialize with all possible categories
    const activityData: ActivityDataPoint[] = [
      { category: 'New Users', count: 0 },
      { category: 'Assessments', count: 0 },
      { category: 'Consultations', count: 0 },
      { category: 'Blog Views', count: 0 }
    ];

    // Get new users in the last 7 days
    try {
      const usersQuery = `
        SELECT COUNT(*) as count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '7 day'
      `;
      const usersResult = await sql.query(usersQuery);
      activityData[0].count = parseInt(usersResult[0].count) || 0;
    } catch (err) {
      console.error('Error fetching recent users:', err);
    }

    // Get assessments in the last 7 days
    try {
      const assessmentsQuery = `
        SELECT COUNT(*) as count
        FROM ai_assessments
        WHERE created_at >= NOW() - INTERVAL '7 day'
      `;
      const assessmentsResult = await sql.query(assessmentsQuery);
      activityData[1].count = parseInt(assessmentsResult[0].count) || 0;
    } catch (err) {
      console.error('Error fetching recent assessments:', err);
    }

    // Get consultations in the last 7 days
    try {
      const consultationsQuery = `
        SELECT COUNT(*) as count
        FROM consultations
        WHERE created_at >= NOW() - INTERVAL '7 day'
      `;
      const consultationsResult = await sql.query(consultationsQuery);
      activityData[2].count = parseInt(consultationsResult[0].count) || 0;
    } catch (err) {
      console.error('Error fetching recent consultations:', err);
    }

    // Get blog views in the last 7 days
    try {
      const blogViewsQuery = `
        SELECT SUM(view_count) as count
        FROM blog_posts
        WHERE updated_at >= NOW() - INTERVAL '7 day'
      `;
      const blogViewsResult = await sql.query(blogViewsQuery);
      activityData[3].count = parseInt(blogViewsResult[0].count) || 0;
    } catch (err) {
      console.error('Error fetching recent blog views:', err);
    }

    return activityData;
  } catch (error) {
    console.error('Error in getRecentActivityData:', error);
    throw error;
  }
}

/**
 * Get assessment category breakdown
 */
export async function getAssessmentCategoryBreakdown(): Promise<CategoryBreakdown[]> {
  try {
    const query = `
      SELECT 
        category,
        COUNT(*) as count
      FROM ai_assessments
      GROUP BY category
      ORDER BY count DESC
    `;

    const result = await sql.query(query);
    
    // Calculate total
    const total = result.reduce(
      (sum, row) => sum + parseInt(row.count), 0
    );
    
    // Convert to percentage
    return result.map(row => ({
      name: row.category,
      count: parseInt(row.count),
      percentage: Math.round((parseInt(row.count) / total) * 100)
    }));
  } catch (error) {
    console.error('Error in getAssessmentCategoryBreakdown:', error);
    throw error;
  }
}

/**
 * Get tool usage data
 */
export async function getToolUsageData(): Promise<{ name: string; count: number }[]> {
  try {
    const query = `
      SELECT 
        t.name,
        COUNT(u.id) as count
      FROM ai_tools t
      LEFT JOIN tool_usage u ON t.id = u.tool_id
      WHERE t.is_active = true
      GROUP BY t.id, t.name
      ORDER BY count DESC
      LIMIT 10
    `;

    const result = await sql.query(query);
    return result.map(row => ({
      name: row.name,
      count: parseInt(row.count) || 0
    }));
  } catch (error) {
    console.error('Error in getToolUsageData:', error);
    // If tool_usage table doesn't exist, return mock data
    return [
      { name: 'Agent Builder', count: 24 },
      { name: 'DataLens', count: 18 },
      { name: 'Strategy Analyzer', count: 15 },
      { name: 'n8n Integration', count: 12 },
      { name: 'Canvas Designer', count: 10 }
    ];
  }
}