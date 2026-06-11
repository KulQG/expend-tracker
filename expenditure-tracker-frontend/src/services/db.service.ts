import Dexie, { type Table } from 'dexie';
import type { LocalExpenditure } from '../api/types';

class AppDatabase extends Dexie {
  expenditures!: Table<LocalExpenditure, number>;

  constructor() {
    super('ExpendituresDB');
    this.version(1).stores({
      expenditures: 'id, _syncStatus, name, date, createdAt'
    });
  }
}

export const db = new AppDatabase();

export const expendituresRepo = {
  getPage: (page: number, limit: number) => 
    db.expenditures
      .where('_syncStatus')
      .notEqual('pending_delete')
      .reverse()
      .offset((page - 1) * limit)
      .limit(limit)
      .toArray(),

  getTotal: () => 
    db.expenditures
      .where('_syncStatus')
      .notEqual('pending_delete')
      .count(),

  saveLocal: (item: LocalExpenditure) => db.expenditures.put(item),
  deletePhysical: (id: number) => db.expenditures.delete(id),
};