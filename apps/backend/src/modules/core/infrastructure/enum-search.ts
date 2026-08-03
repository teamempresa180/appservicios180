/**
 * Helpers shared by every Prisma repository's `search(term)`.
 *
 * Several modules search over enum columns (`status`, `type`,
 * `method`, `level`). Prisma cannot express `contains` on an enum
 * column, so those repositories used to `findMany()` the **entire
 * table** with no `where` at all and then `.filter()` in Node. That is
 * a full table scan plus a full result set over the wire on every
 * search request — the single most expensive query shape in the app.
 *
 * The set of possible enum values is known at compile time, so the
 * substring match can be resolved against that small list *first* and
 * pushed down to the database as an indexed `IN (...)`. Same results,
 * one bounded query.
 */

/**
 * Upper limit on rows returned by any endpoint that is not paginated
 * (`search`, `findByX` feeds). Prevents a single request from pulling
 * an unbounded result set into memory and over the wire.
 */
export const MAX_UNPAGINATED_RESULTS = 200;

/**
 * The enum values whose (upper-case) name contains `term`, matching
 * the previous in-memory `row.field.includes(term.toUpperCase())`
 * exactly. An empty result means no row can match, so the caller can
 * skip the query entirely.
 */
export function enumValuesMatching<T extends string>(
  enumObject: Record<string, T>,
  term: string,
): T[] {
  const upper = term.toUpperCase();
  return Object.values(enumObject).filter((value) => value.includes(upper));
}
