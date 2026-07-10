import '../../../authentication/entities/authentication.dart';
import '../../../credentials/entities/credential.dart';
import '../../../identity/entities/identity.dart';

/// Contract for reading the domain entities the Security screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`, no
/// JSON. Implemented today by `MockSecurityRepository`; a future
/// `ApiSecurityRepository` would implement this same interface (see
/// the feature README).
abstract class SecurityRepository {
  Identity getIdentity();
  List<Authentication> getAuthMethods();
  List<Credential> getCredentials();
}
