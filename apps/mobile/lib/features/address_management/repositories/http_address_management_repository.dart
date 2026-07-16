import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/session/session_manager.dart';
import '../../../profiles/entities/profile.dart';
import 'address_management_repository.dart';

/// [AddressManagementRepository] backed by [ApiClient].
///
/// `GET /profiles`, `GET /addresses` and `GET /contacts` have no
/// `?identityId=` query filter on the backend, so — same interim
/// shape as `HttpOrdersRepository.getQuoteFor` — [getAddresses] and
/// [getProfile] list the full unfiltered collection and match
/// `identityId == sessionManager.currentUserId` client-side.
/// [getProfile] takes the first match (this account is expected to
/// have exactly one profile), throwing a `StateError` if none is
/// found, exactly like `HttpChatRepository._fetchChat`.
///
/// [getContactFor] follows the same client-side-filter shape, but
/// scoped by the given [Address]'s own `identityId` rather than the
/// current session's — matching the documented contract ("filter
/// Contacts by `identityId == address.identityId`"). Adding real
/// `?identityId=` query filters is the natural Prompt 76 follow-up.
class HttpAddressManagementRepository implements AddressManagementRepository {
  HttpAddressManagementRepository(this._apiClient, this._sessionManager);

  final ApiClient _apiClient;
  final SessionManager _sessionManager;

  String get _identityId => _sessionManager.currentUserId!;

  @override
  Future<List<Address>> getAddresses() async {
    final json = await _apiClient.get('/addresses');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['identityId'] == _identityId)
        .map(AddressHttpMapper.fromJson)
        .toList();
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
  Future<Contact> getContactFor(Address address) async {
    final json = await _apiClient.get('/contacts');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final match = items.firstWhere(
      (item) => item['identityId'] == address.identityId.value,
      orElse: () => throw StateError(
        'No contact found for identity ${address.identityId.value}',
      ),
    );
    return ContactHttpMapper.fromJson(match);
  }
}
