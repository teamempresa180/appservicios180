import '../models/security_display.dart';
import '../repositories/security_repository.dart';

/// Composes a [SecurityDisplay] from a [SecurityRepository] — the
/// conversion this feature's page used to do inline in `_buildData()`.
/// Depends on the repository *contract*, not `MockSecurityRepository`,
/// so this same mapper keeps working unchanged for any implementation
/// (see `PROJECT_STATUS.md`, Sprint 2, Etapa 6).
abstract final class SecurityMapper {
  static Future<SecurityDisplay> toDisplay(
    SecurityRepository repository,
  ) async {
    final identity = await repository.getIdentity();
    final authMethods = await repository.getAuthMethods();
    final credentials = await repository.getCredentials();
    final auditLog = await repository.getAuditLog();
    return SecurityDisplay(
      identity: identity,
      authMethods: authMethods,
      credentials: credentials,
      auditLog: auditLog,
    );
  }
}
