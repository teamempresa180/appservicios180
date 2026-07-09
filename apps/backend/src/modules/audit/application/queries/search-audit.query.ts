/**
 * Intent to search Audit records by a free-text term. Plain data — no behavior.
 */
export class SearchAuditQuery {
  constructor(public readonly term: string) {}
}
