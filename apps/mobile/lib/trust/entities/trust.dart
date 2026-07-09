import '../../core/base/entity.dart';
import '../../identity/models/identity_id.dart';
import '../models/trust_id.dart';
import '../models/trust_score.dart';
import '../models/trust_level.dart';
import '../models/trust_status.dart';

/// Represents the trust/reputation record of a person. Pure data holder —
/// no scoring logic, no persistence, no business rules.
class Trust extends Entity<TrustId> {
  const Trust({
    required TrustId id,
    required this.identityId,
    required this.score,
    required this.level,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final IdentityId identityId;
  final TrustScore score;
  final TrustLevel level;
  final TrustStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;
}
