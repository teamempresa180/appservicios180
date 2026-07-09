/**
 * Intent to list Payments with pagination. Plain data — no behavior.
 */
export class ListPaymentQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
