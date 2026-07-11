import '../../../audit/entities/audit.dart';
import '../../../authentication/entities/authentication.dart';
import '../../../credentials/entities/credential.dart';
import '../../../identity/entities/identity.dart';

/// Remote (API/Firebase) source for the domain entities the Security
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class SecurityRemoteDataSource {
  Future<Identity> getIdentity();
  Future<List<Authentication>> getAuthMethods();
  Future<List<Credential>> getCredentials();
  Future<List<Audit>> getAuditLog();
}
