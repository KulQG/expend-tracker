import { create } from "zustand";
import { expendituresApi } from "../api/expenditures.api";
import { expendituresRepo, db } from "../services/db.service";
import { isBackendReady } from "./useNetworkStore";
import type {
  CreateExpenditureRequest,
  Expenditure,
  LocalExpenditure,
} from "../api/types";

interface ExpendituresState {
  items: LocalExpenditure[];
  currentPage: number;
  totalPages: number;
  fetchPage: (page?: number) => Promise<void>;
  create: (data: CreateExpenditureRequest) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

const LIMIT = 10;
let backendTotal: number | null = null;

export const useExpendituresStore = create<ExpendituresState>((set, get) => ({
  items: [],
  currentPage: 1,
  totalPages: 1,

  fetchPage: async (page = get().currentPage) => {
    const loadLocal = async () => {
      const items = await expendituresRepo.getPage(page, LIMIT);
      const total = backendTotal ?? (await expendituresRepo.getTotal());
      set({
        items,
        currentPage: page,
        totalPages: Math.ceil(total / LIMIT) || 1,
      });
    };

    if (isBackendReady()) {
      try {
        const res = await expendituresApi.getAll(page, LIMIT);
        backendTotal = res.meta.total;
        await syncPageToLocal(page, res);
        await loadLocal();
        return;
      } catch (error) {
        console.warn("Фоллбэк на IndexedDB", error);
      }
    }

    await loadLocal();
  },

  create: async (data) => {
    const tempExp: LocalExpenditure = {
      id: Date.now(),
      ...data,
      sum: data.sum.toString(),
      createdAt: new Date().toISOString(),
      _syncStatus: "pending_create",
    };

    await expendituresRepo.saveLocal(tempExp);

    if (backendTotal !== null) backendTotal += 1;

    get().fetchPage();

    if (isBackendReady()) {
      const newExp = await expendituresApi.create(data);
      await db.transaction("rw", db.expenditures, async () => {
        await expendituresRepo.deletePhysical(tempExp.id);
        await expendituresRepo.saveLocal({ ...newExp, _syncStatus: "synced" });
      });
      get().fetchPage();
    }
  },

  remove: async (id) => {
    const item = await db.expenditures.get(id);
    if (!item) return;

    await expendituresRepo.saveLocal({
      ...item,
      _syncStatus: "pending_delete",
    });

    if (backendTotal !== null) backendTotal -= 1;

    get().fetchPage();

    if (isBackendReady()) {
      await expendituresApi.delete(id);
      await expendituresRepo.deletePhysical(id);
    }
  },
}));

async function syncPageToLocal(
  page: number,
  res: { items: Expenditure[] },
): Promise<void> {
  await db.transaction("rw", db.expenditures, async () => {
    const pendingItems = await db.expenditures
      .where("_syncStatus")
      .notEqual("synced")
      .toArray();
    const pendingIds = new Set(pendingItems.map((p) => p.id));
    const backendIds = new Set(res.items.map((item) => item.id));

    const currentPageItems = await expendituresRepo.getPage(page, LIMIT);
    const toDelete = currentPageItems
      .filter((item) => !pendingIds.has(item.id) && !backendIds.has(item.id))
      .map((item) => item.id);

    if (toDelete.length > 0) {
      await db.expenditures.bulkDelete(toDelete);
    }

    const safeToUpdate = res.items
      .map((item) => ({ ...item, _syncStatus: "synced" as const }))
      .filter((item) => !pendingIds.has(item.id));

    await db.expenditures.bulkPut(safeToUpdate);
  });
}
