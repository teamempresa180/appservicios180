/**
 * Intent to fetch a single Payment by id. Plain data — no behavior.
 */
export class GetPaymentQuery {
  constructor(public readonly id: string) {}
}
