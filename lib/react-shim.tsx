"use client"

import { useCallback, useRef } from "react"

/**
 * Polyfill for React's experimental useEffectEvent hook
 * This mimics the behavior using standard React hooks
 */
export function useEffectEvent<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback)

  // Keep the callback ref updated with the latest callback
  callbackRef.current = callback

  // Return a stable function that calls the latest callback
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args)
  }, []) as T
}

// Export as if from React
const React = { useEffectEvent }
export default React
