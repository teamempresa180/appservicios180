import { Caller } from '../../../core/application/caller';
import {
  normalizePage,
  normalizePageSize,
} from '../../../core/application/pagination';

/**
 * Intent to list Payments with pagination. Plain data — no behavior.
 * `caller` is who is asking: `ListPaymentUseCase` returns only the
 * Payments that caller paid or received.
 */
export class ListPaymentQuery {
  public readonly page: number;
  public readonly pageSize: number;

  constructor(
    public readonly caller: Caller,
    page: number = 1,
    pageSize: number = 20,
  ) {
    this.page = normalizePage(page);
    this.pageSize = normalizePageSize(pageSize);
  }
}
