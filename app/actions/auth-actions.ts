"use server"

import { cookies } from "next/headers"

// This function runs only on the server and can safely use the sensitive key
export async function authenticateWithStack(credentials: { email: string; password: string }) {
  try {
    const response = await fetch("https://api.stack.com/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STACK_PUBLISHABLE_CLIENT_KEY}`,
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.message || "Authentication failed" }
    }

    // Set auth cookies securely
    if (data.token) {
      cookies().set("auth-token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
    }

    return { success: true, userId: data.userId }
  } catch (error) {
    console.error("Auth error:", error)
    return { success: false, error: "Authentication service unavailable" }
  }
}
