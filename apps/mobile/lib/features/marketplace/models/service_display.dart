import '../../../service/entities/service.dart';

/// Presentation-only composition of a [Service] with the extra display
/// data a card needs (resolved provider/category names, simulated
/// rating). These fields intentionally do NOT live on the `Service`
/// domain entity — it only knows `providerId`/`categoryId` (IDs), per
/// the domain's "no embedded entities" rule. No `Map`, no `dynamic` —
/// every field is typed.
class ServiceDisplay {
  const ServiceDisplay({
    required this.service,
    required this.providerName,
    required this.categoryName,
    required this.rating,
  });

  final Service service;
  final String providerName;
  final String categoryName;
  final double rating;
}
