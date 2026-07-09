/**
 * Intent to mark an existing Notification as read. Plain data — no behavior.
 */
export class MarkNotificationAsReadCommand {
  constructor(public readonly id: string) {}
}
