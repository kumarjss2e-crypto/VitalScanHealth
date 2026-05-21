"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseAsyncActionOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useAsyncAction<T, Args extends any[]>(
  action: (...args: Args) => Promise<T>,
  options: UseAsyncActionOptions<T> = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: Args) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await action(...args);
        
        if (options.successMessage) {
          toast.success(options.successMessage);
        }
        
        options.onSuccess?.(result);
        return result;
      } catch (e: any) {
        const err = e instanceof Error ? e : new Error(e.message || "An error occurred");
        setError(err);
        
        if (options.errorMessage || err.message) {
          toast.error(options.errorMessage || err.message);
        }
        
        options.onError?.(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [action, options]
  );

  return {
    execute,
    isLoading,
    error,
  };
}
