/**
 * Intent to fetch a single Notification by id. Plain data — no behavior.
 */
export class GetNotificationQuery {
  constructor(public readonly id: string) {}
}
