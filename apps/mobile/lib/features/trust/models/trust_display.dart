import '../../../identity/entities/identity.dart';
import '../../../trust/entities/trust.dart';
import '../../../trust/models/trust_level.dart';
import '../../../trust/models/trust_status.dart';

/// Presentation-only composition of everything the Trust screen needs.
/// Composes two real domain entities — [identity], [trust] — plus one
/// field with no domain equivalent:
///
/// - [factors]: **fully simulated**. The domain `Trust` entity is
///   documented as "pure data holder — no scoring logic, no ...
///   calculation logic", so there is no real breakdown of which
///   factors produced [trust]'s score/level. See the feature README.
///
/// Everything else — score, level, status, last updated — is **real,
/// not fabricated**: direct passthrough of `Trust.score`/`Trust.level`/
/// `Trust.status`/`Trust.updatedAt`, following the same "derived, not
/// simulated" judgment call already used across the rest of this
/// project (e.g. `OrderDisplay.scheduledDate`,
/// `AvailabilityDisplay.activeDaysCount`) — unlike `Verification`, this
/// prompt did not restrict the repository to a subset of entities, so
/// the real `Trust` module is used directly instead of being
/// re-simulated.
///
/// Nothing here is added to the domain entities themselves. No `Color`
/// is stored anywhere — every widget resolves it from `context.colors.*`
/// at build time.
class TrustDisplay {
  const TrustDisplay({
    required this.identity,
    required this.trust,
    required this.factors,
  });

  final Identity identity;
  final Trust trust;

  /// Simulated — see the class doc.
  final List<String> factors;

  String get displayName => identity.fullName;

  /// Real domain data (`Trust.score.value`) — see the class doc.
  num get scoreValue => trust.score.value;

  /// UI label derived from `Trust.level` — see the class doc.
  String get levelText {
    switch (trust.level) {
      case TrustLevel.low:
        return 'Bajo';
      case TrustLevel.medium:
        return 'Medio';
      case TrustLevel.high:
        return 'Alto';
      case TrustLevel.veryHigh:
        return 'Muy alto';
    }
  }

  /// UI label derived from `Trust.status` — see the class doc.
  String get statusText {
    switch (trust.status) {
      case TrustStatus.active:
        return 'Activo';
      case TrustStatus.suspended:
        return 'Suspendido';
      case TrustStatus.archived:
        return 'Archivado';
    }
  }

  /// Real domain data (`Trust.updatedAt`) — see the class doc.
  DateTime get lastUpdated => trust.updatedAt;
}
