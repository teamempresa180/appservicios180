import '../../core/base/entity.dart';
import '../../identity/models/identity_id.dart';
import '../models/credential_id.dart';
import '../models/credential_type.dart';
import '../models/credential_status.dart';

/// Represents that a credential record of a given type exists for an Identity.
/// Pure data holder — never stores the actual secret, hash, or key material;
/// no persistence, no business rules.
class Credential extends Entity<CredentialId> {
  const Credential({
    required CredentialId id,
    required this.identityId,
    required this.type,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final IdentityId identityId;
  final CredentialType type;
  final CredentialStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;
}
