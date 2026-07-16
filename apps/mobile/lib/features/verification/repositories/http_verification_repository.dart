import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/session/session_manager.dart';
import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';
import 'verification_repository.dart';

/// [VerificationRepository] backed by [ApiClient].
///
/// There is no dedicated `Verification` backend module/entity yet in
/// this codebase, matching this feature's own interface (deliberately
/// scoped to `Identity`/`Profile` only — see
/// `verification_repository.dart`'s class doc). [getIdentity] is a
/// direct `GET /identities/:id` lookup off
/// [SessionManager.currentUserId] (the JWT `sub` claim). `GET
/// /profiles` has no `?identityId=` query filter on the backend, so —
/// same interim shape as `HttpOrdersRepository.getQuoteFor` —
/// [getProfile] lists the full unfiltered collection and matches
/// `identityId` client-side, taking the first match and throwing a
/// `StateError` if none is found, exactly like
/// `HttpChatRepository._fetchChat`. Adding a real `?identityId=` query
/// filter is the natural Prompt 76 follow-up.
class HttpVerificationRepository implements VerificationRepository {
  HttpVerificationRepository(this._apiClient, this._sessionManager);

  final ApiClient _apiClient;
  final SessionManager _sessionManager;

  String get _identityId => _sessionManager.currentUserId!;

  @override
  Future<Identity> getIdentity() async {
    final json = await _apiClient.get('/identities/$_identityId');
    return IdentityHttpMapper.fromJson(json);
  }

  @override
  Future<Profile> getProfile() async {
    final json = await _apiClient.get('/profiles');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final match = items.firstWhere(
      (item) => item['identityId'] == _identityId,
      orElse: () =>
          throw StateError('No profile found for identity $_identityId'),
    );
    return ProfileHttpMapper.fromJson(match);
  }
}
