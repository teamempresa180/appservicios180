import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/session/session_manager.dart';
import '../../../profiles/entities/profile.dart';
import '../mock/mock_settings_data.dart';
import '../models/settings_option.dart';
import 'settings_repository.dart';

/// [SettingsRepository] backed by [ApiClient] for [getProfile] only.
///
/// `GET /profiles` has no `?identityId=` query filter on the backend,
/// so — same interim shape as `HttpOrdersRepository.getQuoteFor` —
/// [getProfile] lists the full unfiltered collection and matches
/// `identityId == sessionManager.currentUserId` client-side, taking
/// the first match and throwing a `StateError` if none is found,
/// exactly like `HttpChatRepository._fetchChat`. Adding a real
/// `?identityId=` query filter is the natural Prompt 76 follow-up.
///
/// [getOptions] has no backend equivalent at all — it is a static UI
/// enum of menu options (see `settings_repository.dart`'s class doc
/// and `SettingsOptionId`'s own doc), so it keeps returning the fixed
/// `mockSettingsOptions` list, only wrapped in `Future.value` for
/// signature consistency with the rest of this interface.
class HttpSettingsRepository implements SettingsRepository {
  HttpSettingsRepository(this._apiClient, this._sessionManager);

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
  Future<List<SettingsOptionId>> getOptions() =>
      Future.value(List.unmodifiable(mockSettingsOptions));
}
