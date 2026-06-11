import { Response } from "express";
import { INotificationService } from "./notification.interface";

class SSEService implements INotificationService {
  private clients: Set<Response> = new Set();

  addClient(res: Response) {
    this.clients.add(res);

    res.on("close", () => {
      this.clients.delete(res);
    });
  }

  broadcast(event: string, data: Record<string, unknown> = {}) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.clients) {
      client.write(payload);
    }
  }
}

export const sseServiceInstance = new SSEService();
