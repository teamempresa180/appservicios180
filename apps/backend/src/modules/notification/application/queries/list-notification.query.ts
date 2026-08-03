import {
  normalizePage,
  normalizePageSize,
} from '../../../core/application/pagination';

/**
 * Intent to list Notifications with pagination. Plain data — no behavior.
 */
export class ListNotificationQuery {
  public readonly page: number;
  public readonly pageSize: number;

  constructor(page: number = 1, pageSize: number = 20) {
    this.page = normalizePage(page);
    this.pageSize = normalizePageSize(pageSize);
  }
}
