import '../models/security_display.dart';
import '../repositories/security_repository.dart';

/// Composes a [SecurityDisplay] from a [SecurityRepository] — the
/// conversion this feature's page used to do inline in `_buildData()`.
/// Depends on the repository *contract*, not `MockSecurityRepository`,
/// so this same mapper keeps working unchanged once a real
/// repository implementation exists (see `PROJECT_STATUS.md`, Sprint
/// 2, Etapa 6).
abstract final class SecurityMapper {
  static SecurityDisplay toDisplay(SecurityRepository repository) {
    return SecurityDisplay(
      identity: repository.getIdentity(),
      authMethods: repository.getAuthMethods(),
      credentials: repository.getCredentials(),
      auditLog: repository.getAuditLog(),
    );
  }
}
