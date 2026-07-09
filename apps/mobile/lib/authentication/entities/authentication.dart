import '../../core/base/entity.dart';
import '../../identity/models/identity_id.dart';
import '../models/authentication_id.dart';
import '../models/auth_method_type.dart';
import '../models/authentication_status.dart';

/// Represents the association between an Identity and a method it can use to
/// authenticate. Pure data holder — no login flow, no token issuance, no
/// password/secret storage, no persistence.
class Authentication extends Entity<AuthenticationId> {
  const Authentication({
    required AuthenticationId id,
    required this.identityId,
    required this.methodType,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final IdentityId identityId;
  final AuthMethodType methodType;
  final AuthenticationStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;
}
