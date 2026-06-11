import { useEffect, useRef } from 'react';
import { syncService } from '../services/sync.service';
import { sseService } from '../services/sse.service';
import { useExpendituresStore } from '../stores/useExpendituresStore';
import { useNetworkStore } from '../stores/useNetworkStore';

export const useAppInit = () => {
  const { setOnline, checkHealth, isServerHealthy } = useNetworkStore();
  const fetchPage = useExpendituresStore(state => state.fetchPage);
  
  const wasHealthyRef = useRef(isServerHealthy);
  const isSyncing = useRef(false);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const heartbeat = async () => {
      const currentlyHealthy = await checkHealth();

      if (currentlyHealthy && !wasHealthyRef.current) {
        if (!isSyncing.current) {
          try {
            isSyncing.current = true;
            await syncService.process();
            await fetchPage();
            sseService.connect(fetchPage); 
          } finally {
            isSyncing.current = false;
          }
        }
      }

      if (!currentlyHealthy && wasHealthyRef.current) {
        sseService.disconnect();
      }

      wasHealthyRef.current = currentlyHealthy;
    };

    const interval = setInterval(heartbeat, 15000);
    
    heartbeat();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
      sseService.disconnect();
    };
  }, [setOnline, checkHealth, fetchPage]);
};