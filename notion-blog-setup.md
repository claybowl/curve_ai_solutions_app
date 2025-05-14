# Setting Up Notion Blog Integration

This document guides you through setting up the Notion integration for your blog and adding test posts.

## Environment Configuration

1. Create or update your `.env.local` file in the project root with the following variables:

```
# Notion Blog
NOTION_TOKEN=your_notion_integration_token
NOTION_BLOG_DATABASE_ID=your_notion_database_id
```

## Getting Your Notion Token

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Set the appropriate capabilities (Read content, Read user information, etc.)
4. Copy the "Internal Integration Token"
5. Add this token as `NOTION_TOKEN` in your `.env.local` file

## Creating a Notion Database for Your Blog

1. In Notion, create a new page
2. Add a database (full page or inline)
3. Configure the database with the following properties:
   - Title (Title type) - Required
   - Slug (Text type) - Custom URL path for each post
   - Description (Text type) - Summary of the post
   - Date (Date type) - Publication date
   - Published (Checkbox type) - Whether the post is published
   - Content (Rich text) - Your post content

4. Share the database with your integration:
   - Click "Share" on your database
   - Click "Add people, emails, groups, or integrations"
   - Find your integration by name and add it

5. Get your database ID:
   - Open your database in Notion
   - Look at the URL: `https://www.notion.so/workspace/[database_id]?v=...`
   - Copy the database ID (the part after workspace/ and before ?)
   - Add this ID as `NOTION_BLOG_DATABASE_ID` in your `.env.local` file

## Adding a Test Post

1. In your Notion database, create a new entry
2. Fill in:
   - Title: Your post title (e.g., "Getting Started with Curve AI")
   - Slug: A URL-friendly version of your title (e.g., "getting-started-with-curve-ai")
   - Description: A brief summary of your post
   - Date: Today's date
   - Published: Check this box to make the post visible
   - Add content to your page

3. The post should now appear in your blog at `/blog` and the individual post at `/blog/your-slug`

## Troubleshooting

If your blog posts don't appear:
- Verify your environment variables are correctly set
- Ensure your Notion integration has access to your database
- Check that posts have the "Published" checkbox checked
- Restart your development server with `npm run dev` 