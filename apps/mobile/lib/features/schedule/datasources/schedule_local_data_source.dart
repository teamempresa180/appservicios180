import '../../../provider/entities/provider.dart';
import '../../../schedule/entities/schedule.dart';

/// Local (on-device) source for the domain entities the Schedule
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class ScheduleLocalDataSource {
  Provider getProvider();
  List<Schedule> getSchedules();
}
