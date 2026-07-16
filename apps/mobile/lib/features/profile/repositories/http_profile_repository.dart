import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/session/session_manager.dart';
import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';
import 'profile_repository.dart';

/// [ProfileRepository] backed by [ApiClient].
///
/// The feature interface still models a single fixed account (see
/// `profile_repository.dart`'s own doc comment: "no id-based lookup
/// yet"). [getIdentity] is a direct `GET /identities/:id` lookup off
/// [SessionManager.currentUserId] (the JWT `sub` claim, i.e. the
/// current identity's id).
///
/// [getProfile], [getContacts] and [getAddress] have the same interim
/// shape as `HttpOrdersRepository.getQuoteFor`: the backend's
/// `GET /profiles`, `GET /contacts` and `GET /addresses` have no
/// `?identityId=` query filter, so each lists the full unfiltered
/// collection and matches `identityId` client-side.
/// [getProfile]/[getAddress] then take the first match (this account
/// is expected to have exactly one profile and one address, matching
/// what the previous mock data represented) — throwing a `StateError`
/// if none is found, exactly like `HttpChatRepository._fetchChat`.
/// Adding real `?identityId=` query filters is the natural Prompt 76
/// follow-up.
class HttpProfileRepository implements ProfileRepository {
  HttpProfileRepository(this._apiClient, this._sessionManager);

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

  @override
  Future<List<Contact>> getContacts() async {
    final json = await _apiClient.get('/contacts');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['identityId'] == _identityId)
        .map(ContactHttpMapper.fromJson)
        .toList();
  }

  @override
  Future<Address> getAddress() async {
    final json = await _apiClient.get('/addresses');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final match = items.firstWhere(
      (item) => item['identityId'] == _identityId,
      orElse: () =>
          throw StateError('No address found for identity $_identityId'),
    );
    return AddressHttpMapper.fromJson(match);
  }
}
