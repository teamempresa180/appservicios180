/**
 * The delivery/read state of a Message. No transport mechanism is implied.
 */
export enum MessageStatus {
  Sent = 'SENT',
  Delivered = 'DELIVERED',
  Read = 'READ',
}
