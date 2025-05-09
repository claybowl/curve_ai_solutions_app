/**
 * Utility functions for authentication
 */

/**
 * Check if the current user is an admin based on their token
 */
export function isAdminUser(): boolean {
  if (typeof window === "undefined") return false

  try {
    const token = localStorage.getItem("admin-token")
    if (!token) return false

    const [_, role] = token.split(":")
    return role === "admin"
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

/**
 * Get the current user's ID from their token
 */
export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null

  try {
    const token = localStorage.getItem("admin-token")
    if (!token) return null

    const [userId, _] = token.split(":")
    return userId
  } catch (error) {
    console.error("Error getting user ID:", error)
    return null
  }
}

/**
 * Get the current user's role from their token
 */
export function getCurrentUserRole(): string | null {
  if (typeof window === "undefined") return null

  try {
    const token = localStorage.getItem("admin-token")
    if (!token) return null

    const [_, role] = token.split(":")
    return role
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}

/**
 * Perform a logout operation
 */
export async function logoutUser(router?: any): Promise<void> {
  try {
    // Clear local storage
    localStorage.removeItem("admin-token")
    sessionStorage.removeItem("user-data")

    // Call logout API
    await fetch("/api/logout", { method: "POST" })
  } catch (error) {
    console.error("Error during logout:", error)
  } finally {
    // Redirect if router is provided
    if (router) {
      router.push("/")
    } else if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }
}
