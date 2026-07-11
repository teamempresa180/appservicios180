import '../../../provider/entities/provider.dart';
import '../../../schedule/entities/schedule.dart';

/// Remote (API/Firebase) source for the domain entities the Schedule
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class ScheduleRemoteDataSource {
  Future<Provider> getProvider();
  Future<List<Schedule>> getSchedules();
}
