import '../../../category/entities/category.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';

/// Presentation-only composition of a search match. The domain does not
/// (and should not) model a joined "search result" — this is only
/// [Service] + its [Provider] + its [Category], plus three simulated
/// fields (`rating`, `reviewsCount`, `distance`) that a real `Review`
/// aggregate and geolocation would compute. Nothing else — see the
/// feature README for why this composition exists and stays this
/// minimal.
class SearchResult {
  const SearchResult({
    required this.service,
    required this.provider,
    required this.category,
    required this.rating,
    required this.reviewsCount,
    required this.distance,
  });

  final Service service;
  final Provider provider;
  final Category category;

  /// Simulated — no `Review` aggregate is consulted yet.
  final double rating;

  /// Simulated — no `Review` aggregate is consulted yet.
  final int reviewsCount;

  /// Simulated distance in kilometers — no real geolocation yet.
  final double distance;
}
