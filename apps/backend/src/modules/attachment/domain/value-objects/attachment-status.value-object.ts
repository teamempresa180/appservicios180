/**
 * The lifecycle status of an Attachment record. No storage operation is
 * implied.
 */
export enum AttachmentStatus {
  Pending = 'PENDING',
  Available = 'AVAILABLE',
  Failed = 'FAILED',
  Removed = 'REMOVED',
}
