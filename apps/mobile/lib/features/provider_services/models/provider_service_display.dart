import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_status.dart';

/// Presentation-only composition of everything a Provider Services
/// card needs. Composes four real domain entities — [provider],
/// [profile], [service], [category] — plus fields with no domain
/// equivalent yet:
///
/// - [viewsCount], [requestsCount]: **fully simulated** — `Service` is
///   a "pure data holder" (per its own class doc: "no availability, no
///   scheduling, no pricing rules, no reviews, no location"), with no
///   analytics/impression tracking of any kind.
/// - [featured]: **fully simulated** — no domain module models a
///   "featured" flag for services yet.
/// - [lastUpdatedLabel]: **fully simulated** — a relative-time label
///   with no backing timestamp field to derive it from consistently
///   across the mock set (unlike `Order`/`Payment`/`Notification`,
///   `Service.updatedAt` isn't varied per mock entry here).
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
    required this.viewsCount,
    required this.requestsCount,
    required this.featured,
    required this.lastUpdatedLabel,
  });

  final Provider provider;
  final Profile profile;
  final Service service;
  final Category category;

  /// Simulated — see the class doc.
  final int viewsCount;

  /// Simulated — see the class doc.
  final int requestsCount;

  /// Simulated — see the class doc.
  final bool featured;

  /// Simulated — see the class doc.
  final String lastUpdatedLabel;

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
