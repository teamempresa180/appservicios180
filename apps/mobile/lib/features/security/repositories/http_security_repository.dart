import '../../../audit/entities/audit.dart';
import '../../../authentication/entities/authentication.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/session/session_manager.dart';
import '../../../credentials/entities/credential.dart';
import '../../../identity/entities/identity.dart';
import 'mock_security_repository.dart';
import 'security_repository.dart';

/// [SecurityRepository] backed by [ApiClient] — **partially real**.
///
/// [getIdentity] and [getAuditLog] are genuine HTTP calls:
/// `GET /identities/:id` for the current session's identity, and
/// `GET /audit-records` filtered client-side by `identityId` (same
/// interim pattern documented on `HttpOrdersRepository.getQuoteFor` —
/// no `GET /audit-records?identityId=` filter exists on the backend).
///
/// [getAuthMethods] and [getCredentials] are **not migratable at all**
/// with the current backend surface: `authentications` and
/// `credentials` only expose `GET /:id` — no list, no search, no
/// identity filter of any kind (unlike every other module, which at
/// least has an unfiltered `GET` list to filter client-side). There is
/// no way to enumerate "all auth methods/credentials for the current
/// identity" from the client at all. This looks like an intentional
/// security boundary (bulk-enumerating credential records is a
/// sensitive operation), not an oversight — so this delegates those
/// two methods to [MockSecurityRepository] rather than inventing a
/// new backend endpoint (out of scope: "no rediseñar arquitectura").
/// Adding a properly-scoped, identity-filtered list endpoint for both
/// modules is the real fix, left for a future backend-focused prompt.
class HttpSecurityRepository implements SecurityRepository {
  HttpSecurityRepository(this._apiClient, this._sessionManager);

  final ApiClient _apiClient;
  final SessionManager _sessionManager;
  final _mockFallback = MockSecurityRepository();

  @override
  Future<Identity> getIdentity() async {
    final json = await _apiClient.get(
      '/identities/${_sessionManager.currentUserId}',
    );
    return IdentityHttpMapper.fromJson(json);
  }

  @override
  Future<List<Authentication>> getAuthMethods() =>
      _mockFallback.getAuthMethods();

  @override
  Future<List<Credential>> getCredentials() => _mockFallback.getCredentials();

  @override
  Future<List<Audit>> getAuditLog() async {
    final identityId = _sessionManager.currentUserId;
    final json = await _apiClient.get('/audit-records');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['identityId'] == identityId)
        .map(AuditHttpMapper.fromJson)
        .toList();
  }
}
