import '../../core/base/entity.dart';
import '../../identity/models/identity_id.dart';
import '../models/verification_id.dart';
import '../models/verification_type.dart';
import '../models/verification_status.dart';

/// Represents a verification record (e.g. document, facial, address) tied to
/// an Identity. Pure data holder — no behavior, no persistence, no business rules.
class Verification extends Entity<VerificationId> {
  const Verification({
    required VerificationId id,
    required this.identityId,
    required this.type,
    required this.status,
    required this.verifiedAt,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final IdentityId identityId;
  final VerificationType type;
  final VerificationStatus status;
  final DateTime? verifiedAt;
  final DateTime createdAt;
  final DateTime updatedAt;
}
