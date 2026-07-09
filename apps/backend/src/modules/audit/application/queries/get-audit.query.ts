/**
 * Intent to fetch a single Audit record by id. Plain data — no behavior.
 */
export class GetAuditQuery {
  constructor(public readonly id: string) {}
}
