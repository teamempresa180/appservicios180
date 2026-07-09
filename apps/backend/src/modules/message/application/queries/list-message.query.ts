/**
 * Intent to list Messages with pagination. Plain data — no behavior.
 */
export class ListMessageQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
