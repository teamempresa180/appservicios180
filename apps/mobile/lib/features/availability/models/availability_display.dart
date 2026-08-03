import '../../../availability/entities/availability.dart';
import '../../../availability/models/availability_status.dart';
import '../../../provider/entities/provider.dart';

/// Presentation-only composition of everything the Availability screen
/// needs. Composes two real domain entities — [provider],
/// [availabilities].
///
/// **Nothing here is simulated anymore.** [nextAvailableLabel] and
/// [workingHoursLabel] used to be fixed mock strings shown to every
/// provider regardless of their actual schedule ("Mañana a las 8:00"
/// for someone who doesn't work Mondays); both are now derived from
/// the real records below, and say so honestly when there is nothing
/// to derive from.
///
/// Three fields the prompt asked for already have a real domain source
/// and are exposed as **derived getters** instead of being fabricated
/// a second time, following the same judgment call already documented
/// for `OrderDisplay.scheduledDate`, `AddressDisplay.label` and
/// `ProviderServiceDisplay.isPublished`:
///
/// - [activeDaysCount]/[inactiveDaysCount]: **derived**, not simulated
///   — counted directly from the real [availabilities] by
///   `Availability.status`.
/// - [weeklyAvailabilityPercentage]: **derived**, not simulated —
///   `activeDaysCount / 7 * 100`.
///
/// [availabilities] is expected to hold exactly one real `Availability`
/// per day of the week (Monday–Sunday), each representing that day's
/// schedule via its own real `status`/`availableFrom`/`availableTo` —
/// **which day** a record represents is itself derived from the real
/// `Availability.availableFrom.weekday`, not a separate simulated
/// "day label" field (see `mock_availability_data.dart` and
/// `WeeklySchedule`).
///
/// Nothing here is added to the domain entities themselves. No `Color`
/// or `IconData` is stored anywhere in this model — every widget
/// resolves both purely from `context.colors.*`/`Icons.*` at build
/// time.
class AvailabilityDisplay {
  const AvailabilityDisplay({
    required this.provider,
    required this.availabilities,
    DateTime? now,
  }) : _now = now;

  final Provider provider;
  final List<Availability> availabilities;

  /// Reference "current time" for [nextAvailableLabel]. Injectable so
  /// tests are deterministic; production leaves it null and gets
  /// `DateTime.now()`.
  final DateTime? _now;

  static const _shortDayNames = [
    'Lun',
    'Mar',
    'Mié',
    'Jue',
    'Vie',
    'Sáb',
    'Dom',
  ];

  static String _formatTime(DateTime time) =>
      '${time.hour.toString().padLeft(2, '0')}:'
      '${time.minute.toString().padLeft(2, '0')}';

  Iterable<Availability> get _activeDays =>
      availabilities.where((a) => a.status == AvailabilityStatus.active);

  /// The next active day of the week, starting from today — derived
  /// from the real [availabilities]. `'Sin disponibilidad'` when the
  /// provider has no active day at all, rather than a made-up slot.
  String get nextAvailableLabel {
    final active = _activeDays.toList();
    if (active.isEmpty) return 'Sin disponibilidad';

    final todayWeekday = (_now ?? DateTime.now()).weekday;
    // Days ahead of today (0 = today), so "next" wraps around Sunday
    // instead of always reporting Monday.
    active.sort((a, b) {
      int distance(Availability x) =>
          (x.availableFrom.weekday - todayWeekday + 7) % 7;
      final byDistance = distance(a).compareTo(distance(b));
      if (byDistance != 0) return byDistance;
      return a.availableFrom.hour.compareTo(b.availableFrom.hour);
    });

    final next = active.first;
    final isToday = next.availableFrom.weekday == todayWeekday;
    final dayLabel = isToday
        ? 'Hoy'
        : _shortDayNames[next.availableFrom.weekday - 1];
    return '$dayLabel ${_formatTime(next.availableFrom)}';
  }

  /// One-line summary of the provider's working hours — the earliest
  /// start and latest end across every active day, derived from the
  /// real [availabilities].
  String get workingHoursLabel {
    final active = _activeDays.toList();
    if (active.isEmpty) {
      return 'Todavía no tienes días activos en tu horario.';
    }
    var earliest = active.first.availableFrom;
    var latest = active.first.availableTo;
    for (final day in active.skip(1)) {
      final start = day.availableFrom;
      final end = day.availableTo;
      if (start.hour * 60 + start.minute < earliest.hour * 60 + earliest.minute) {
        earliest = start;
      }
      if (end.hour * 60 + end.minute > latest.hour * 60 + latest.minute) {
        latest = end;
      }
    }
    return 'Atiendes entre las ${_formatTime(earliest)} y las '
        '${_formatTime(latest)}, ${active.length} '
        'día${active.length == 1 ? '' : 's'} a la semana.';
  }

  /// Derived from the real [availabilities] — see the class doc.
  int get activeDaysCount =>
      availabilities.where((a) => a.status == AvailabilityStatus.active).length;

  /// Derived from the real [availabilities] — see the class doc.
  int get inactiveDaysCount => availabilities.length - activeDaysCount;

  /// Derived from [activeDaysCount] — see the class doc.
  double get weeklyAvailabilityPercentage => availabilities.isEmpty
      ? 0
      : activeDaysCount / availabilities.length * 100;
}
