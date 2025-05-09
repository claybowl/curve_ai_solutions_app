// This file is used to fetch the public project ID from the server
// No sensitive keys are used here

export async function getAuthConfig() {
  try {
    const response = await fetch("/api/auth/stack-config")
    const data = await response.json()
    return { projectId: data.projectId }
  } catch (error) {
    console.error("Failed to load auth configuration", error)
    return { projectId: null }
  }
}
