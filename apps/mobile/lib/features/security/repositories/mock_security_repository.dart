import '../../../audit/entities/audit.dart';
import '../../../authentication/entities/authentication.dart';
import '../../../credentials/entities/credential.dart';
import '../../../identity/entities/identity.dart';
import '../mock/mock_security_data.dart';
import 'security_repository.dart';

/// In-memory `SecurityRepository` backed by fixed mock data. No
/// backend, no persistence, no network, no real login flow — see the
/// feature README.
class MockSecurityRepository implements SecurityRepository {
  @override
  Future<Identity> getIdentity() => Future.value(mockSecurityIdentity);

  @override
  Future<List<Authentication>> getAuthMethods() =>
      Future.value(List.unmodifiable(mockAuthMethods));

  @override
  Future<List<Credential>> getCredentials() =>
      Future.value(List.unmodifiable(mockCredentials));

  @override
  Future<List<Audit>> getAuditLog() =>
      Future.value(List.unmodifiable(mockAuditLog));
}
