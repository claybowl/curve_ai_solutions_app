# Curve AI Solutions - Deployment Guide

This guide provides comprehensive instructions for deploying the Curve AI Solutions web application both locally for development and to Vercel for production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Building for Production](#building-for-production)
- [Vercel Deployment](#vercel-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/) (pnpm is recommended for this project)
- [Git](https://git-scm.com/)
- Code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/))

## Local Development Setup

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/curve_ai_solutions_app.git
cd curve_ai_solutions_app
```

2. **Install dependencies:**

Using pnpm (recommended):
```bash
pnpm install
```

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

3. **Create environment variables:**

Create a `.env.local` file in the root directory with the required environment variables (see [Environment Variables](#environment-variables) section).

4. **Start the development server:**

```bash
pnpm dev
```

This will start the Next.js development server on [http://localhost:3000](http://localhost:3000).

## Database Setup

The application uses a PostgreSQL database hosted on [Neon](https://neon.tech). You can either connect to an existing database or create a new one.

### Using Existing Database

1. Get your PostgreSQL connection string, which should look something like:
```
postgres://username:password@hostname:port/database
```

2. Add this connection string to your `.env.local` file (see [Environment Variables](#environment-variables) section).

### Setting Up a New Database

1. Create an account on [Neon](https://neon.tech)
2. Create a new project and database
3. Get your connection strings from the Neon dashboard
4. Add these to your `.env.local` file
5. Initialize your database schema:

```bash
psql "your-connection-string" -f db-schema.sql
```

Or you can use the SQL console in the Neon dashboard to run the contents of the `db-schema.sql` file.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Database connection (required)
DATABASE_URL=postgres://your_username:your_password@your_host/your_database?sslmode=require

# Optional: Unpooled connection for certain operations
DATABASE_URL_UNPOOLED=postgresql://your_username:your_password@your_host/your_database?sslmode=require

# For NextAuth.js (generate a secret with `openssl rand -base64 32`)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Optional: Email service for auth (if needed)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM=your-email@example.com
```

## Building for Production

To create a production build:

```bash
pnpm build
```

To test the production build locally:

```bash
pnpm start
```

This will start the production server on [http://localhost:3000](http://localhost:3000).

## Vercel Deployment

### Option 1: Deploy from Vercel Dashboard

1. Create an account on [Vercel](https://vercel.com)
2. Create a new project
3. Import your GitHub repository
4. Configure environment variables in the Vercel dashboard:
   - Add all variables from your `.env.local` file
5. Deploy your application

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

### Connecting to Your Neon Database on Vercel

1. Add your database environment variables to Vercel:
   - Go to your project on the Vercel dashboard
   - Navigate to "Settings" > "Environment Variables"
   - Add your database connection strings and other required variables

2. Redeploy your application for the changes to take effect

## Troubleshooting

### Database Connection Issues

- Ensure your database credentials are correct
- Check if your IP is allowed in the Neon firewall settings
- Verify SSL configuration in your connection string

### Build Errors

- Make sure all dependencies are installed correctly
- Check for any TypeScript errors in your code
- Ensure environment variables are properly set up

### Runtime Errors

- Check browser console for JavaScript errors
- Verify server logs on Vercel dashboard
- Ensure database schema is properly initialized

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs) 