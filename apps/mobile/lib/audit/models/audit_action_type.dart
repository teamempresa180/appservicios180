/// The kind of action a person performed, captured for traceability.
enum AuditActionType {
  created,
  updated,
  deleted,
  accessed,
  loggedIn,
  loggedOut,
  other,
}
