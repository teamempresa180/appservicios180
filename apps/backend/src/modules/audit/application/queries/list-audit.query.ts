/**
 * Intent to list Audit records with pagination. Plain data — no behavior.
 */
export class ListAuditQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
