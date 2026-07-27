import '../../../audit/entities/audit.dart';
import '../../../authentication/entities/authentication.dart';
import '../../../authentication/models/auth_method_type.dart';
import '../../../authentication/models/authentication_id.dart';
import '../../../authentication/models/authentication_status.dart';
import '../../../credentials/entities/credential.dart';
import '../../../identity/entities/identity.dart';
import '../mock/mock_security_data.dart';
import 'security_repository.dart';

/// In-memory `SecurityRepository` backed by fixed mock data. No
/// backend, no persistence, no network, no real login flow — see the
/// feature README. `_authMethods` is mutable so `createAuthMethod`/
/// `updateAuthMethodStatus`/`deleteAuthMethod` behave like real CRUD
/// within a single app session.
class MockSecurityRepository implements SecurityRepository {
  final List<Authentication> _authMethods = List.of(mockAuthMethods);

  @override
  Future<Identity> getIdentity() => Future.value(mockSecurityIdentity);

  @override
  Future<List<Authentication>> getAuthMethods() =>
      Future.value(List.unmodifiable(_authMethods));

  @override
  Future<List<Credential>> getCredentials() =>
      Future.value(List.unmodifiable(mockCredentials));

  @override
  Future<List<Audit>> getAuditLog() =>
      Future.value(List.unmodifiable(mockAuditLog));

  @override
  Future<Authentication> createAuthMethod({
    required Identity identity,
    required AuthMethodType methodType,
  }) async {
    final now = DateTime.now();
    final authMethod = Authentication(
      id: AuthenticationId.create(),
      identityId: identity.id,
      methodType: methodType,
      status: AuthenticationStatus.active,
      createdAt: now,
      updatedAt: now,
    );
    _authMethods.add(authMethod);
    return authMethod;
  }

  @override
  Future<Authentication> updateAuthMethodStatus(
    Authentication authMethod,
    AuthenticationStatus status,
  ) async {
    final updated = authMethod.copyWith(status: status);
    final index = _authMethods.indexWhere((a) => a.id == authMethod.id);
    if (index != -1) _authMethods[index] = updated;
    return updated;
  }

  @override
  Future<void> deleteAuthMethod(Authentication authMethod) async {
    _authMethods.removeWhere((a) => a.id == authMethod.id);
  }
}
