import '../../../availability/entities/availability.dart';
import '../../../availability/models/availability_status.dart';
import '../../../provider/entities/provider.dart';

/// Presentation-only composition of everything the Availability screen
/// needs. Composes two real domain entities — [provider],
/// [availabilities] — plus fields with no domain equivalent yet:
///
/// - [nextAvailableLabel]: **fully simulated** — no real-time/calendar
///   logic exists to compute an actual next open slot from a set of
///   weekly `Availability` records.
/// - [workingHoursLabel]: **fully simulated** — a one-line summary of
///   "working hours" that would require aggregating every day's
///   `availableFrom`/`availableTo` into a single human sentence; that
///   aggregation logic doesn't exist yet, so this is a plain
///   placeholder label.
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
    required this.nextAvailableLabel,
    required this.workingHoursLabel,
  });

  final Provider provider;
  final List<Availability> availabilities;

  /// Simulated — see the class doc.
  final String nextAvailableLabel;

  /// Simulated — see the class doc.
  final String workingHoursLabel;

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
