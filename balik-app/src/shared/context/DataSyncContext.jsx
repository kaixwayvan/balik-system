import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

/**
 * DataSyncContext - Manages data synchronization state across the app
 * Prevents data duplication and manages coordinated refresh cycles
 */
const DataSyncContext = createContext();

export const DataSyncProvider = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncError, setSyncError] = useState(null);
  const syncInProgressRef = useRef(false);
  const syncTimeoutRef = useRef(null);

  const MIN_SYNC_INTERVAL = 60 * 1000; // 60 seconds - minimum time between syncs

  /**
   * Execute a coordinated data sync
   * Only one sync can happen at a time, others are queued
   */
  const executeSync = useCallback(async (syncFn, options = {}) => {
    const { 
      force = false, 
      timeout = 10000,
      onError = null 
    } = options;

    const now = Date.now();
    const timeSinceLastSync = lastSyncTime ? now - lastSyncTime : Infinity;

    // Check if sync is already in progress
    if (syncInProgressRef.current) {
      console.log('[DataSync] Sync already in progress, queuing...');
      return new Promise((resolve) => {
        // Wait for existing sync to complete, then resolve
        const checkTimer = setInterval(() => {
          if (!syncInProgressRef.current) {
            clearInterval(checkTimer);
            resolve();
          }
        }, 100);
      });
    }

    // Check throttle unless forced
    if (!force && timeSinceLastSync < MIN_SYNC_INTERVAL) {
      const waitTime = MIN_SYNC_INTERVAL - timeSinceLastSync;
      console.log(`[DataSync] Sync throttled - please wait ${Math.round(waitTime / 1000)}s`);
      return;
    }

    syncInProgressRef.current = true;
    setIsSyncing(true);
    setSyncError(null);

    try {
      console.log('[DataSync] Starting coordinated sync...');
      
      // Execute the sync with timeout
      const syncPromise = syncFn();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sync timeout')), timeout)
      );

      await Promise.race([syncPromise, timeoutPromise]);
      
      setLastSyncTime(now);
      console.log('[DataSync] Sync completed successfully');
    } catch (error) {
      console.error('[DataSync] Sync error:', error);
      setSyncError(error.message);
      
      if (onError) {
        onError(error);
      }
    } finally {
      syncInProgressRef.current = false;
      setIsSyncing(false);
    }
  }, [lastSyncTime]);

  /**
   * Check if sync is needed
   */
  const shouldSync = useCallback(() => {
    if (!lastSyncTime) return true;
    const timeSinceLastSync = Date.now() - lastSyncTime;
    return timeSinceLastSync >= MIN_SYNC_INTERVAL;
  }, [lastSyncTime]);

  /**
   * Manually invalidate sync and force refresh
   */
  const invalidateSync = useCallback(() => {
    console.log('[DataSync] Invalidating sync');
    setLastSyncTime(null);
    setSyncError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  const value = {
    isSyncing,
    lastSyncTime,
    syncError,
    executeSync,
    shouldSync,
    invalidateSync,
  };

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  );
};

export const useDataSync = () => {
  const context = useContext(DataSyncContext);
  if (!context) {
    throw new Error('useDataSync must be used within DataSyncProvider');
  }
  return context;
};
