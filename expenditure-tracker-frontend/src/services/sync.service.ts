import { db } from "./db.service";
import { expendituresApi } from "../api/expenditures.api";
import type { CreateExpenditureRequest } from "../api/types";

export const syncService = {
  process: async () => {
    const pendingCreates = await db.expenditures
      .where("_syncStatus")
      .equals("pending_create")
      .toArray();

    for (const item of pendingCreates) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _syncStatus, id, createdAt, sum, ...payload } = item;
        const serverItem = await expendituresApi.create({
          sum: Number(sum),
          ...payload,
        } as CreateExpenditureRequest);

        await db.transaction("rw", db.expenditures, async () => {
          await db.expenditures.delete(item.id);
          await db.expenditures.put({ ...serverItem, _syncStatus: "synced" });
        });
      } catch (error) {
        console.error(`Ошибка синхронизации создания для ID ${item.id}`, error);
      }
    }

    const pendingDeletes = await db.expenditures
      .where("_syncStatus")
      .equals("pending_delete")
      .toArray();

    for (const item of pendingDeletes) {
      try {
        await expendituresApi.delete(item.id);
        await db.expenditures.delete(item.id); // Физически удаляем из локальной БД
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error?.status === 404) {
          await db.expenditures.delete(item.id);
        } else {
          console.error(
            `Ошибка синхронизации удаления для ID ${item.id}`,
            error,
          );
        }
      }
    }
  },
};
