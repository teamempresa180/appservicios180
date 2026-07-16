import '../../../provider/entities/provider.dart';
import '../../../schedule/entities/schedule.dart';
import '../mock/mock_schedule_data.dart';
import 'schedule_repository.dart';

/// In-memory `ScheduleRepository` backed by fixed mock data. No
/// backend, no persistence, no network, no calendar sync — see the
/// feature README.
class MockScheduleRepository implements ScheduleRepository {
  @override
  Future<Provider> getProvider() => Future.value(mockScheduleProvider);

  @override
  Future<List<Schedule>> getSchedules() => Future.value(mockSchedules);
}
