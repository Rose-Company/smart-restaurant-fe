import { useEffect, useRef, useCallback } from 'react';
import { serveApi, Table, TablesResponse } from '../services/serve.api';

interface UsePollingTablesOptions {
  params?: {
    page?: number;
    page_size?: number;
    status?: 'occupied' | 'available' | 'reserved' | 'cleaning';
    location?: string;
    is_help_needed?: boolean;
    is_ready_to_bill?: boolean;
  };
  enabled?: boolean;
  intervalMs?: number;
  onSuccess?: (data: TablesResponse) => void;
  onError?: (error: Error) => void;
}

export const usePollingTables = (options: UsePollingTablesOptions = {}) => {
  const {
    params,
    enabled = true,
    intervalMs = 10000, // 10 seconds default
    onSuccess,
    onError
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const callbacksRef = useRef({ onSuccess, onError });
  const paramsRef = useRef(params);

  // Update callbacks ref without affecting interval
  useEffect(() => {
    callbacksRef.current = { onSuccess, onError };
  }, [onSuccess, onError]);

  // Update params ref without affecting interval
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchTables = async () => {
      if (!enabled) return;
      
      try {
        const token = localStorage.getItem('admin_auth_token');
        const data = await serveApi.getTablesList(paramsRef.current, token || undefined);
        
        if (isMountedRef.current) {
          callbacksRef.current.onSuccess?.(data);
        }
      } catch (error) {
        if (isMountedRef.current) {
          callbacksRef.current.onError?.(error instanceof Error ? error : new Error('Failed to fetch tables'));
        }
      }
    };

    // Initial fetch
    if (enabled) {
      fetchTables();
    }

    // Set up polling interval
    if (enabled) {
      intervalRef.current = setInterval(() => {
        fetchTables();
      }, intervalMs);
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, intervalMs]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(async () => {
    if (!intervalRef.current) {
      const token = localStorage.getItem('admin_auth_token');
      const data = await serveApi.getTablesList(params, token || undefined);
      if (isMountedRef.current) {
        callbacksRef.current.onSuccess?.(data);
      }
      
      intervalRef.current = setInterval(async () => {
        const token = localStorage.getItem('admin_auth_token');
        const data = await serveApi.getTablesList(params, token || undefined);
        if (isMountedRef.current) {
          callbacksRef.current.onSuccess?.(data);
        }
      }, intervalMs);
    }
  }, [params, intervalMs]);

  const refetch = useCallback(async () => {
    const token = localStorage.getItem('admin_auth_token');
    const data = await serveApi.getTablesList(params, token || undefined);
    if (isMountedRef.current) {
      callbacksRef.current.onSuccess?.(data);
    }
  }, [params]);

  return { stopPolling, startPolling, refetch };
};
