/**
 * The general nature of a notification's content. A plain label — no
 * delivery channel, no sending logic.
 */
export enum NotificationType {
  System = 'SYSTEM',
  Info = 'INFO',
  Warning = 'WARNING',
  Alert = 'ALERT',
  Other = 'OTHER',
}
