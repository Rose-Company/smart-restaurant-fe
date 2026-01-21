import { useEffect, useRef, useCallback } from 'react';
import { serveApi, TableDetail, OrderItem } from '../services/serve.api';

interface UsePollingOrdersOptions {
  tableId?: number;
  enabled?: boolean;
  intervalMs?: number;
  onSuccess?: (data: { items: OrderItem[]; total: number }) => void;
  onError?: (error: Error) => void;
}

export const usePollingOrders = (options: UsePollingOrdersOptions = {}) => {
  const {
    tableId,
    enabled = true,
    intervalMs = 10000, // 10 seconds default
    onSuccess,
    onError
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const callbacksRef = useRef({ onSuccess, onError });
  const tableIdRef = useRef(tableId);

  // Update callbacks ref without affecting interval
  useEffect(() => {
    callbacksRef.current = { onSuccess, onError };
  }, [onSuccess, onError]);

  // Update tableId ref without affecting interval
  useEffect(() => {
    tableIdRef.current = tableId;
  }, [tableId]);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchOrders = async () => {
      if (!enabled || !tableIdRef.current) return;
      
      try {
        const token = localStorage.getItem('admin_auth_token');
        if (!token) {
          throw new Error('No admin token found');
        }

        const tableDetail = await serveApi.getTableDetail(tableIdRef.current, token);
        
        if (isMountedRef.current && tableDetail) {
          callbacksRef.current.onSuccess?.({
            items: tableDetail.order_items || [],
            total: tableDetail.total_bill || 0
          });
        }
      } catch (error) {
        if (isMountedRef.current) {
          callbacksRef.current.onError?.(error instanceof Error ? error : new Error('Failed to fetch orders'));
        }
      }
    };

    // Initial fetch
    if (enabled && tableIdRef.current) {
      fetchOrders();
    }

    // Set up polling interval
    if (enabled && tableIdRef.current) {
      intervalRef.current = setInterval(() => {
        fetchOrders();
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
    if (!intervalRef.current && tableId) {
      const token = localStorage.getItem('admin_auth_token');
      if (token) {
        const tableDetail = await serveApi.getTableDetail(tableId, token);
        if (isMountedRef.current && tableDetail) {
          callbacksRef.current.onSuccess?.({
            items: tableDetail.order_items || [],
            total: tableDetail.total_bill || 0
          });
        }
      }
      
      intervalRef.current = setInterval(async () => {
        const token = localStorage.getItem('admin_auth_token');
        if (token) {
          const tableDetail = await serveApi.getTableDetail(tableId, token);
          if (isMountedRef.current && tableDetail) {
            callbacksRef.current.onSuccess?.({
              items: tableDetail.order_items || [],
              total: tableDetail.total_bill || 0
            });
          }
        }
      }, intervalMs);
    }
  }, [tableId, intervalMs]);

  const refetch = useCallback(async () => {
    if (tableId) {
      const token = localStorage.getItem('admin_auth_token');
      if (token) {
        const tableDetail = await serveApi.getTableDetail(tableId, token);
        if (isMountedRef.current && tableDetail) {
          callbacksRef.current.onSuccess?.({
            items: tableDetail.order_items || [],
            total: tableDetail.total_bill || 0
          });
        }
      }
    }
  }, [tableId]);

  return { stopPolling, startPolling, refetch };
};
