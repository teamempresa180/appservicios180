import { Caller } from '../../../core/application/caller';
import {
  normalizePage,
  normalizePageSize,
} from '../../../core/application/pagination';

/**
 * Intent to list Quotes with pagination. Plain data — no behavior.
 * `caller` is who is asking: `ListQuoteUseCase` returns only the
 * Quotes that caller is a party to (see the Use Case).
 */
export class ListQuoteQuery {
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
