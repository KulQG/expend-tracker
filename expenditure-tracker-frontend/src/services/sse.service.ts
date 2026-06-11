let eventSource: EventSource | null = null;

export const sseService = {
  connect: (onUpdate: () => void) => {
    if (eventSource) return;

    eventSource = new EventSource(`${import.meta.env.VITE_PUBLIC_API_URL_EXPENDITURES}sse`);
    
    eventSource.addEventListener('expenditures_updated', () => {
      onUpdate();
    });

    eventSource.onerror = () => {
      console.warn("SSE соединение потеряно");
      sseService.disconnect();
    };
  },
  
  disconnect: () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  }
};