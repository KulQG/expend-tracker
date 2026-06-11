import { Request, Response, NextFunction } from "express";
import { ExpendituresService } from "./expenditures.service";
import { INotificationService } from "../../services/notification.interface";
import { sseServiceInstance } from "../../services/sse.service";

export class ExpendituresController {
  constructor(
    private readonly service: ExpendituresService,
    private readonly notifier: INotificationService,
    private readonly sseTransport: typeof sseServiceInstance,
  ) {}

  private notifyClients() {
    this.notifier.broadcast("expenditures_updated", { timestamp: Date.now() });
  }

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const result = await this.service.findAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const expenditure = await this.service.create(req.body);
      this.notifyClients();
      res.status(201).json(expenditure);
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.service.delete(id);
      this.notifyClients();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  subscribeSSE = (_: Request, res: Response): void => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    this.sseTransport.addClient(res);

    const heartbeat = setInterval(() => {
      res.write(":\n\n");
    }, 30000);

    res.on("close", () => {
      clearInterval(heartbeat);
    });
  };
}
