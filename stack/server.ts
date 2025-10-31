/**
 * Stack Auth Server Configuration
 * 
 * This file initializes Stack Auth for server-side operations.
 * Get your API keys from https://app.stack-auth.com/
 */

import { StackServerApp } from "@stackframe/js";

if (!process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
  throw new Error("Missing NEXT_PUBLIC_STACK_PROJECT_ID environment variable")
}

if (!process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY) {
  throw new Error("Missing NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY environment variable")
}

if (!process.env.STACK_SECRET_SERVER_KEY) {
  throw new Error("Missing STACK_SECRET_SERVER_KEY environment variable")
}

export const stackServerApp = new StackServerApp({
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
  tokenStore: "memory", // Can be changed to "cookie" or custom implementation
});

