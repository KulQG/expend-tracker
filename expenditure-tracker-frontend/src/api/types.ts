export interface Expenditure {
  id: number;
  name: string;
  sum: string;
  date: string;
  createdAt: string;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExpendituresResponse {
  items: Expenditure[];
  meta: PaginatedMeta;
}

export interface CreateExpenditureRequest {
  name: string;
  sum: number;
  date: string;
}

export interface ApiValidationError {
  error: string;
  details?: Record<string, string>;
}

export type SyncStatus = 'synced' | 'pending_create' | 'pending_delete';

export interface LocalExpenditure extends Expenditure {
  _syncStatus: SyncStatus;
}
