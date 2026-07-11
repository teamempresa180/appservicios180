import '../../../audit/entities/audit.dart';
import '../../../authentication/entities/authentication.dart';
import '../../../credentials/entities/credential.dart';
import '../../../identity/entities/identity.dart';

/// Local (on-device) source for the domain entities the Security
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class SecurityLocalDataSource {
  Identity getIdentity();
  List<Authentication> getAuthMethods();
  List<Credential> getCredentials();
  List<Audit> getAuditLog();
}
