import '../../../audit/entities/audit.dart';
import '../../../authentication/entities/authentication.dart';
import '../../../credentials/entities/credential.dart';
import '../../../identity/entities/identity.dart';

/// Plain data shape a future `SecurityRemoteDataSource` would receive
/// from a real API response for this screen — the same fields
/// [SecurityDisplay] composes, but without its derived getters (those
/// stay presentation-only, computed by `SecurityMapper`/the widgets).
/// No `fromJson`/`toJson` yet — only the structure, see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
class SecurityDto {
  const SecurityDto({
    required this.identity,
    required this.authMethods,
    required this.credentials,
    required this.auditLog,
  });

  final Identity identity;
  final List<Authentication> authMethods;
  final List<Credential> credentials;
  final List<Audit> auditLog;
}
