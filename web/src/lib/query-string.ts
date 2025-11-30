import type { StringifyOptions } from "query-string";

export const QUERY_STRING_OPTIONS: StringifyOptions = {
  skipNull: true,
  skipEmptyString: true,
};
