/**
 * Intent to fetch a single Order by id. Plain data — no behavior.
 */
export class GetOrderQuery {
  constructor(public readonly id: string) {}
}
