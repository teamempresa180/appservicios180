import '../../../contact/entities/contact.dart';
import '../../../contact/models/contact_type.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/session/session_manager.dart';
import '../../../profiles/entities/profile.dart';
import 'contact_management_repository.dart';

/// [ContactManagementRepository] backed by [ApiClient].
///
/// Both `GET /profiles` and `GET /contacts` have no `?identityId=`
/// query filter on the backend, so — same interim shape as
/// `HttpOrdersRepository.getQuoteFor` — [getProfile] and [getContacts]
/// each list the full unfiltered collection and match
/// `identityId == sessionManager.currentUserId` client-side.
/// [getProfile] takes the first match (this account is expected to
/// have exactly one profile), throwing a `StateError` if none is
/// found, exactly like `HttpChatRepository._fetchChat`. Adding real
/// `?identityId=` query filters is the natural Prompt 76 follow-up.
class HttpContactManagementRepository implements ContactManagementRepository {
  HttpContactManagementRepository(this._apiClient, this._sessionManager);

  final ApiClient _apiClient;
  final SessionManager _sessionManager;

  String get _identityId => _sessionManager.currentUserId!;

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
  Future<Contact> createContact({
    required ContactType type,
    required String value,
  }) async {
    final json = await _apiClient.post(
      '/contacts',
      data: {
        'identityId': _identityId,
        'type': type.name.toUpperCase(),
        'value': value,
      },
    );
    return ContactHttpMapper.fromJson(json);
  }

  @override
  Future<Contact> updateContact(Contact contact, {required String value}) async {
    final json = await _apiClient.put(
      '/contacts/${contact.id.value}',
      data: {'value': value},
    );
    return ContactHttpMapper.fromJson(json);
  }

  @override
  Future<void> deleteContact(Contact contact) =>
      _apiClient.delete('/contacts/${contact.id.value}');
}
