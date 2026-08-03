/**
 * Shared pagination guards for every module's `List<X>Query`.
 *
 * Controllers build their query object from raw query-string values
 * (`Number(req.query.pageSize)`), so without normalization three bad
 * inputs reached Prisma's `skip`/`take` untouched:
 *
 *  - `?pageSize=abc` → `NaN` → an invalid `take`, a driver-level error
 *    surfaced as a 500 instead of a sane page.
 *  - `?pageSize=1000000` → a single request pulling the whole table
 *    into memory (and over the wire) — the cheapest possible way for
 *    one caller to exhaust the API's memory and the database's
 *    connection budget.
 *  - `?page=0` / `?page=-5` → a negative `skip`, again a driver error.
 *
 * Clamping here (rather than in each controller) keeps every entry
 * point covered: the query object is the single choke point that all
 * `List<X>UseCase`s go through.
 */

/** Page size used when the caller sends nothing usable. */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Hard ceiling on rows returned by any paginated endpoint. Callers
 * asking for more get this instead of an error — the request still
 * succeeds, it just cannot be used to pull an unbounded result set.
 */
export const MAX_PAGE_SIZE = 100;

/** Coerces `page` to a positive integer, defaulting to 1. */
export function normalizePage(page: number): number {
  if (!Number.isFinite(page)) {
    return 1;
  }
  const floored = Math.floor(page);
  return floored < 1 ? 1 : floored;
}

/** Coerces `pageSize` to an integer within `[1, MAX_PAGE_SIZE]`. */
export function normalizePageSize(pageSize: number): number {
  if (!Number.isFinite(pageSize)) {
    return DEFAULT_PAGE_SIZE;
  }
  const floored = Math.floor(pageSize);
  if (floored < 1) {
    return DEFAULT_PAGE_SIZE;
  }
  return floored > MAX_PAGE_SIZE ? MAX_PAGE_SIZE : floored;
}
