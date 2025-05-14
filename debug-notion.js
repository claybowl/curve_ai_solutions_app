// Debug script for Notion connection
const { Client } = require("@notionhq/client");
require('dotenv').config({ path: '.env.local' });

async function debugNotion() {
  console.log("Debugging Notion connection");
  
  // Check if environment variables are loaded
  console.log("NOTION_TOKEN exists:", !!process.env.NOTION_TOKEN);
  console.log("NOTION_BLOG_DATABASE_ID exists:", !!process.env.NOTION_BLOG_DATABASE_ID);
  
  // Mask tokens for security when logging
  if (process.env.NOTION_TOKEN) {
    const maskedToken = process.env.NOTION_TOKEN.substring(0, 4) + "..." + 
      process.env.NOTION_TOKEN.substring(process.env.NOTION_TOKEN.length - 4);
    console.log("NOTION_TOKEN (masked):", maskedToken);
  }
  
  if (process.env.NOTION_BLOG_DATABASE_ID) {
    const maskedDbId = process.env.NOTION_BLOG_DATABASE_ID.substring(0, 4) + "..." + 
      process.env.NOTION_BLOG_DATABASE_ID.substring(process.env.NOTION_BLOG_DATABASE_ID.length - 4);
    console.log("NOTION_BLOG_DATABASE_ID (masked):", maskedDbId);
  }
  
  try {
    // Initialize Notion client
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
    
    console.log("Notion client initialized");
    
    // Test listing users to verify token works
    console.log("Testing Notion API connection...");
    const listUsersResponse = await notion.users.list({});
    console.log("✅ Successfully connected to Notion API");
    console.log(`Found ${listUsersResponse.results.length} users`);
    
    // Test querying the blog database
    console.log("\nTesting database query...");
    const databaseResponse = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DATABASE_ID,
    });
    
    console.log("✅ Successfully queried database");
    console.log(`Found ${databaseResponse.results.length} items in database`);
    
    // Log first few results for inspection
    if (databaseResponse.results.length > 0) {
      console.log("\nFirst database item properties:");
      const firstItem = databaseResponse.results[0];
      console.log("ID:", firstItem.id);
      console.log("Properties:", Object.keys(firstItem.properties));
    }
    
  } catch (error) {
    console.error("❌ Error connecting to Notion:");
    console.error(error);
  }
}

debugNotion(); 