/**
 * Intent to search Notifications by a free-text term. Plain data — no behavior.
 */
export class SearchNotificationQuery {
  constructor(public readonly term: string) {}
}
