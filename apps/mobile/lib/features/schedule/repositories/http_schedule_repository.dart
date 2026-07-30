import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/session/session_manager.dart';
import '../../../provider/entities/provider.dart';
import '../../../schedule/entities/schedule.dart';
import 'schedule_repository.dart';

/// [ScheduleRepository] backed by [ApiClient].
///
/// The feature interface still models a single fixed provider (see
/// `schedule_repository.dart`'s own doc comment: "no id-based lookup
/// yet"). The backend mirrors that limitation — there is no "provider
/// for the current session" endpoint, only `GET /providers`
/// (paginated, unfiltered) and `GET /providers/:id`. [getProvider]
/// takes the first item of the list as the one provider this screen
/// shows, exactly matching what the previous mock data represented (a
/// single fixed provider) — just sourced from the real backend now
/// instead of a hardcoded object.
///
/// [getSchedules] has the same interim shape as
/// `HttpChatRepository.getMessages`: the backend has no
/// `GET /schedules?providerId=` filter, so it lists the full
/// unfiltered collection and matches `providerId` client-side. Adding
/// that query filter is the natural Prompt 76 follow-up.
class HttpScheduleRepository implements ScheduleRepository {
  HttpScheduleRepository(this._apiClient, this._sessionManager);

  final ApiClient _apiClient;
  final SessionManager _sessionManager;

  /// Matches `identityId` against [SessionManager.currentUserId]
  /// client-side — same pattern as `HttpTrustRepository.getTrust` —
  /// instead of blindly taking the first item of the unfiltered
  /// `GET /providers` list, which was a real session-scoping bug
  /// (every provider session would see whichever Provider happened to
  /// be created first in the database).
  Future<Provider> _fetchProvider() async {
    final json = await _apiClient.get('/providers');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final identityId = _sessionManager.currentUserId;
    final match = items.where((item) => item['identityId'] == identityId);
    if (match.isEmpty) {
      throw StateError('No provider found for the current session');
    }
    return ProviderHttpMapper.fromJson(match.first);
  }

  @override
  Future<Provider> getProvider() => _fetchProvider();

  @override
  Future<List<Schedule>> getSchedules() async {
    final provider = await _fetchProvider();
    final json = await _apiClient.get('/schedules');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['providerId'] == provider.id.value)
        .map(ScheduleHttpMapper.fromJson)
        .toList();
  }
}
