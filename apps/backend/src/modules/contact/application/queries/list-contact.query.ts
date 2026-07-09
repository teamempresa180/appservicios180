/**
 * Intent to list Contacts with pagination. Plain data — no behavior.
 */
export class ListContactQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
