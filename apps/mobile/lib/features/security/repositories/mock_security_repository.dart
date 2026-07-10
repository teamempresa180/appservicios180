import '../../../authentication/entities/authentication.dart';
import '../../../identity/entities/identity.dart';
import '../mock/mock_security_data.dart';
import 'security_repository.dart';

/// In-memory `SecurityRepository` backed by fixed mock data. No
/// backend, no persistence, no network, no real login flow — see the
/// feature README.
class MockSecurityRepository implements SecurityRepository {
  @override
  Identity getIdentity() => mockSecurityIdentity;

  @override
  List<Authentication> getAuthMethods() => List.unmodifiable(mockAuthMethods);
}
