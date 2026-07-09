/**
 * Intent to list Services with pagination. Plain data — no behavior.
 */
export class ListServiceQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
