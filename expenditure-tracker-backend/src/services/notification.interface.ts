export interface INotificationService {
  broadcast(event: string, data?: Record<string, unknown>): void;
}