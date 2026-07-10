import '../../../provider/entities/provider.dart';
import '../../../schedule/entities/schedule.dart';
import '../../../schedule/models/schedule_status.dart';

/// Presentation-only composition of everything the Schedule screen
/// needs. Composes two real domain entities — [provider], [schedules]
/// — with **no simulated field at all**, unlike every other feature in
/// this series: everything the screen shows (per-status counts, total
/// open hours, each block's date/time/type/status) is directly
/// derivable from the real `Schedule` list, so nothing needed to be
/// fabricated. See the feature README for why this is an intentional
/// deviation from the usual "at least one simulated field" pattern.
///
/// Nothing here is added to the domain entities themselves. No `Color`
/// or `IconData` is stored anywhere in this model — every widget
/// resolves both purely from `context.colors.*`/`Icons.*` at build
/// time.
class ScheduleDisplay {
  const ScheduleDisplay({required this.provider, required this.schedules});

  final Provider provider;
  final List<Schedule> schedules;

  /// Derived from the real [schedules] — see the class doc.
  int get openCount =>
      schedules.where((s) => s.status == ScheduleStatus.open).length;

  /// Derived from the real [schedules] — see the class doc.
  int get blockedCount =>
      schedules.where((s) => s.status == ScheduleStatus.blocked).length;

  /// Derived from the real [schedules] — see the class doc.
  int get cancelledCount =>
      schedules.where((s) => s.status == ScheduleStatus.cancelled).length;

  /// Derived from the real [schedules] — see the class doc.
  int get completedCount =>
      schedules.where((s) => s.status == ScheduleStatus.completed).length;

  /// Derived from the real [schedules] — see the class doc. Sum of
  /// `endDateTime - startDateTime` across every block with
  /// `status == open`.
  Duration get totalOpenDuration => schedules
      .where((s) => s.status == ScheduleStatus.open)
      .fold(
        Duration.zero,
        (total, s) => total + s.endDateTime.difference(s.startDateTime),
      );
}
