"use client";

import { useState, useCallback } from "react";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000; // 1 minute

export function useLoginThrottle() {
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const remainingSeconds = isLocked
    ? Math.ceil((lockedUntil! - Date.now()) / 1000)
    : 0;

  const recordFailure = useCallback(() => {
    setFailedAttempts((prev) => {
      const next = prev + 1;
      if (next >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setFailedAttempts(0);
    setLockedUntil(null);
  }, []);

  return { isLocked, remainingSeconds, failedAttempts, recordFailure, reset };
}
