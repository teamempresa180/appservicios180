/**
 * The kind of action a person performed, captured for traceability.
 */
export enum AuditActionType {
  Created = 'CREATED',
  Updated = 'UPDATED',
  Deleted = 'DELETED',
  Accessed = 'ACCESSED',
  LoggedIn = 'LOGGED_IN',
  LoggedOut = 'LOGGED_OUT',
  Other = 'OTHER',
}
