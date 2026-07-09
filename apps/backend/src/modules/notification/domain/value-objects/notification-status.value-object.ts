/**
 * The read state of a Notification. No delivery/send pipeline is implied.
 */
export enum NotificationStatus {
  Unread = 'UNREAD',
  Read = 'READ',
  Archived = 'ARCHIVED',
}
