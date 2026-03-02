import { useState, useEffect } from "react";

/**
 * A custom hook to safely extract state from a Zustand store without causing
 * hydration mismatches between Server and Client rendering in Next.js.
 * 
 * @param store The Zustand store hook
 * @param callback The selector function to pick state
 * @returns The selected state or undefined during initial server render
 */
export const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};
