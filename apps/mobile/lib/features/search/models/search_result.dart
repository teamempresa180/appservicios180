import '../../../category/entities/category.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';

/// Presentation-only composition of a search match. The domain does not
/// (and should not) model a joined "search result" — this is only
/// [Service] + its [Provider] + its [Category], plus `rating`/
/// `reviewsCount` (real, derived from `Review` records via the
/// service's provider — see `SearchRepository.ratingOf`) and a
/// simulated `distance` that real geolocation would compute. See the
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

  /// Real — average rating of the service's provider, derived from
  /// `Review` records. See the class doc.
  final double rating;

  /// Real — count of `Review` records for the service's provider.
  final int reviewsCount;

  /// Simulated distance in kilometers — no real geolocation yet.
  final double distance;
}
