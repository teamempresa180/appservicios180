/**
 * Intent to list Addresses with pagination. Plain data — no behavior.
 */
export class ListAddressQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
