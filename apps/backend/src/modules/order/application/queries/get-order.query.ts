import { Caller } from '../../../core/application/caller';

/**
 * Intent to fetch a single Order by id. Plain data — no behavior.
 * `caller` is who is asking: `GetOrderUseCase` only reveals an Order
 * to the customer who requested it, its assigned Provider, or an
 * Admin.
 */
export class GetOrderQuery {
  constructor(
    public readonly id: string,
    public readonly caller: Caller,
  ) {}
}
