"use client"

import { useEffect, useRef, useCallback } from 'react'

interface UsePollingOptions {
  enabled?: boolean
  interval?: number
  immediate?: boolean
}

export function usePolling(
  callback: () => void | Promise<void>,
  options: UsePollingOptions = {}
) {
  const {
    enabled = true,
    interval = 5000,
    immediate = true
  } = options

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const startPolling = useCallback(() => {
    if (!enabled) return

    if (immediate) {
      callbackRef.current()
    }

    intervalRef.current = setInterval(() => {
      callbackRef.current()
    }, interval)
  }, [enabled, interval, immediate])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const restartPolling = useCallback(() => {
    stopPolling()
    startPolling()
  }, [stopPolling, startPolling])

  // Start/stop polling based on enabled state
  useEffect(() => {
    if (enabled) {
      startPolling()
    } else {
      stopPolling()
    }

    return stopPolling
  }, [enabled, startPolling, stopPolling])

  // Cleanup on unmount
  useEffect(() => {
    return stopPolling
  }, [stopPolling])

  return {
    startPolling,
    stopPolling,
    restartPolling,
    isPolling: intervalRef.current !== null
  }
}