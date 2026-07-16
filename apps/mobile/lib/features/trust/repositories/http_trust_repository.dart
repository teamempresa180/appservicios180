import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/session/session_manager.dart';
import '../../../identity/entities/identity.dart';
import '../../../trust/entities/trust.dart';
import 'trust_repository.dart';

/// [TrustRepository] backed by [ApiClient].
///
/// [getIdentity] is a direct `GET /identities/:id` lookup off
/// [SessionManager.currentUserId] (the JWT `sub` claim, i.e. the
/// current identity's id). `GET /trust-profiles` has no
/// `?identityId=` query filter on the backend, so — same interim
/// shape as `HttpOrdersRepository.getQuoteFor` — [getTrust] lists the
/// full unfiltered collection and matches `identityId` client-side,
/// taking the first match (this account is expected to have exactly
/// one trust record) and throwing a `StateError` if none is found,
/// exactly like `HttpChatRepository._fetchChat`. Adding a real
/// `?identityId=` query filter is the natural Prompt 76 follow-up.
class HttpTrustRepository implements TrustRepository {
  HttpTrustRepository(this._apiClient, this._sessionManager);

  final ApiClient _apiClient;
  final SessionManager _sessionManager;

  String get _identityId => _sessionManager.currentUserId!;

  @override
  Future<Identity> getIdentity() async {
    final json = await _apiClient.get('/identities/$_identityId');
    return IdentityHttpMapper.fromJson(json);
  }

  @override
  Future<Trust> getTrust() async {
    final json = await _apiClient.get('/trust-profiles');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final match = items.firstWhere(
      (item) => item['identityId'] == _identityId,
      orElse: () =>
          throw StateError('No trust profile found for identity $_identityId'),
    );
    return TrustHttpMapper.fromJson(match);
  }
}
