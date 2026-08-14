import { Caller } from '../../../core/application/caller';

/**
 * Intent to mark an accepted Order as in progress. Plain data — no
 * behavior. `caller` is who is asking: `StartOrderUseCase` only lets
 * the Provider assigned to the Order, or an Admin, through.
 */
export class StartOrderCommand {
  constructor(
    public readonly id: string,
    public readonly caller: Caller,
  ) {}
}
