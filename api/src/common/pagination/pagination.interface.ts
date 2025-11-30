export type PaginationOptions = {
  page: number;
  limit: number;
};

export interface PaginationMeta {
  limit: number;
  count: number;
  pages: {
    first: number;
    previous: number;
    hasPrevious: boolean;
    current: number;
    next: number;
    hasNext: boolean;
    last: number;
    total: number;
  };
}

export interface Pagination<T> {
  data: T[];
  meta: PaginationMeta;
}
