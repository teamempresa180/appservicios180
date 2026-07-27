import '../../../audit/entities/audit.dart';
import '../../../authentication/entities/authentication.dart';
import '../../../authentication/models/auth_method_type.dart';
import '../../../authentication/models/authentication_status.dart';
import '../../../credentials/entities/credential.dart';
import '../../../identity/entities/identity.dart';

/// Contract for reading the domain entities the Security screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`, no
/// JSON. Implemented today by `MockSecurityRepository` and
/// `HttpSecurityRepository` (real backend — see the latter's class
/// doc for a documented partial-migration limitation).
abstract class SecurityRepository {
  Future<Identity> getIdentity();
  Future<List<Authentication>> getAuthMethods();
  Future<List<Credential>> getCredentials();
  Future<List<Audit>> getAuditLog();

  Future<Authentication> createAuthMethod({
    required Identity identity,
    required AuthMethodType methodType,
  });

  Future<Authentication> updateAuthMethodStatus(
    Authentication authMethod,
    AuthenticationStatus status,
  );

  Future<void> deleteAuthMethod(Authentication authMethod);
}
