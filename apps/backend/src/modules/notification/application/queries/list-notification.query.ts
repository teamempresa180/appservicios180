/**
 * Intent to list Notifications with pagination. Plain data — no behavior.
 */
export class ListNotificationQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
