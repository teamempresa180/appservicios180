import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_status.dart';

/// Presentation-only composition of everything a Provider Services
/// card needs. Composes four real domain entities — [provider],
/// [profile], [service], [category].
///
/// **Nothing here is simulated anymore.** The previous `viewsCount`/
/// `requestsCount`/`featured` fields were removed rather than kept as
/// placeholders: `Service` is a "pure data holder" (per its own class
/// doc: "no availability, no scheduling, no pricing rules, no reviews,
/// no location") with no analytics of any kind behind it, so against
/// the real backend every provider's card showed a flat, invented
/// "0 vistas / 0 solicitudes" — a made-up performance metric on a
/// commercial screen. [lastUpdatedLabel] replaced its simulated
/// predecessor with a label derived from the real `Service.updatedAt`.
///
/// [isPublished] is **real, not fabricated** — derived from
/// `Service.status == ServiceStatus.active`, exposed under the name
/// the prompt asked for. Same judgment call already documented for
/// `ProviderProfileData.experienceYears`, `OrderDisplay.scheduledDate`,
/// `AddressDisplay.label` and `ProviderDashboardDisplay
/// .completedOrdersCount`: no second, fabricated flag — `Service`
/// already models an active/inactive/archived lifecycle.
///
/// Nothing here is added to the domain entities themselves. No `Color`
/// or `IconData` is stored anywhere in this model — every widget
/// resolves both purely from `context.colors.*`/`Icons.*` at build
/// time.
class ProviderServiceDisplay {
  const ProviderServiceDisplay({
    required this.provider,
    required this.profile,
    required this.service,
    required this.category,
    DateTime? now,
  }) : _now = now;

  final Provider provider;
  final Profile profile;
  final Service service;
  final Category category;

  /// Reference "current time" for [lastUpdatedLabel]. Injectable so
  /// tests are deterministic; production leaves it null and gets
  /// `DateTime.now()`.
  final DateTime? _now;

  /// "Actualizado hace ..." derived from the real `Service.updatedAt`
  /// — see the class doc.
  String get lastUpdatedLabel {
    final elapsed = (_now ?? DateTime.now()).difference(service.updatedAt);
    if (elapsed.inMinutes < 1) return 'Actualizado hace un momento';
    if (elapsed.inHours < 1) {
      final minutes = elapsed.inMinutes;
      return 'Actualizado hace $minutes minuto${minutes == 1 ? '' : 's'}';
    }
    if (elapsed.inDays < 1) {
      final hours = elapsed.inHours;
      return 'Actualizado hace $hours hora${hours == 1 ? '' : 's'}';
    }
    if (elapsed.inDays < 30) {
      final days = elapsed.inDays;
      return 'Actualizado hace $days día${days == 1 ? '' : 's'}';
    }
    final months = elapsed.inDays ~/ 30;
    return 'Actualizado hace $months mes${months == 1 ? '' : 'es'}';
  }

  /// Real, derived from `Service.status` — see the class doc.
  bool get isPublished => service.status == ServiceStatus.active;

  /// UI label derived from `Service.status` — a plain label, not a
  /// stored field (same approach as `OrderDisplay.statusText`).
  String get statusText {
    switch (service.status) {
      case ServiceStatus.active:
        return 'Activo';
      case ServiceStatus.inactive:
        return 'Pausado';
      case ServiceStatus.archived:
        return 'Archivado';
    }
  }
}
