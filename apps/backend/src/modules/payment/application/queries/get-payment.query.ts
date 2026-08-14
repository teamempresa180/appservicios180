import { Caller } from '../../../core/application/caller';

/**
 * Intent to fetch a single Payment by id. Plain data — no behavior.
 * `caller` is who is asking: `GetPaymentUseCase` only reveals a
 * Payment to its payer, its receiving Provider, or an Admin.
 */
export class GetPaymentQuery {
  constructor(
    public readonly id: string,
    public readonly caller: Caller,
  ) {}
}
