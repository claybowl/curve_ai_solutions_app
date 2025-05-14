import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string into a readable format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ""
  
  const date = new Date(dateString)
  
  // Check if the date is valid
  if (isNaN(date.getTime())) return ""
  
  // Format options
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
