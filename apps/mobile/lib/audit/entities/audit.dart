import '../../core/base/entity.dart';
import '../../identity/models/identity_id.dart';
import '../models/audit_id.dart';
import '../models/audit_action_type.dart';

/// Represents an immutable audit log entry describing an action performed by
/// an Identity. Pure data holder — no behavior, no persistence, no business rules.
class Audit extends Entity<AuditId> {
  const Audit({
    required AuditId id,
    required this.identityId,
    required this.actionType,
    required this.description,
    required this.occurredAt,
  }) : super(id);

  final IdentityId identityId;
  final AuditActionType actionType;
  final String description;
  final DateTime occurredAt;
}
