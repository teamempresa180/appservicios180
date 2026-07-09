/**
 * Intent to delete an existing Notification. Plain data — no behavior.
 */
export class DeleteNotificationCommand {
  constructor(public readonly id: string) {}
}
