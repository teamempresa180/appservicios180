/**
 * The lifecycle status of an Order.
 */
export enum OrderStatus {
  Pending = 'PENDING',
  Accepted = 'ACCEPTED',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  Rejected = 'REJECTED',
}
