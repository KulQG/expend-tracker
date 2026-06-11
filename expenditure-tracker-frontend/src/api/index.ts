const API_BASE_URL =
  import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:8080/";

export const api = {
  checkHealth: async (): Promise<boolean> => {
    try {
      await fetch(`${API_BASE_URL}health`);
      return true;
    } catch (error) {
      console.error("API health check failed:", error);
      return false;
    }
  },
};
