import z from "zod";

export const DEFAULT_PAGE_MIN = 1;
export const DEFAULT_PAGE = 1;

export const DEFAULT_LIMIT_MIN = 1;
export const DEFAULT_LIMIT_MAX = 100;
export const DEFAULT_LIMIT = 10;

export const DEFAULT_ORDERS = {
  ASC: "ASC",
  DESC: "DESC",
} as const;
export const DEFAULT_ORDER = DEFAULT_ORDERS.ASC;

export const DEFAULT_SORTS = {
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const;

const page = z
  .number()
  .int()
  .positive()
  .min(DEFAULT_PAGE_MIN)
  .default(DEFAULT_PAGE)
  .catch(DEFAULT_PAGE);

const limit = z
  .number()
  .int()
  .positive()
  .min(DEFAULT_LIMIT_MIN)
  .max(DEFAULT_LIMIT_MAX)
  .default(DEFAULT_LIMIT)
  .catch(DEFAULT_LIMIT);
const q = z.string().default("").catch("");
const order = z
  .enum(Object.values(DEFAULT_ORDERS))
  .default(DEFAULT_ORDER)
  .catch(DEFAULT_ORDER);

export const paginationSchema = z.object({
  page,
  limit,
});
export type PaginationSchema = z.infer<typeof paginationSchema>;

export const filterSchema = paginationSchema.extend({
  q,
  order,
});
export type FilterSchema = z.infer<typeof filterSchema>;

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
