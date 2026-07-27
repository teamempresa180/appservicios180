import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
import '../../../service/entities/service.dart';

/// Contract for reading the domain data the Search feature needs.
/// Returns only real domain entities — no `Map`, no `dynamic`.
/// Implemented today by `MockSearchRepository` and
/// `HttpSearchRepository` (see the feature README).
abstract class SearchRepository {
  Future<List<Service>> getAll();

  /// The real `Provider` behind a service's `providerId`.
  Future<Provider> providerOf(ProviderId id);

  /// The real `Category` behind a service's `categoryId`.
  Future<Category> categoryOf(CategoryId id);

  /// Average rating for [providerId], derived from real `Review`
  /// records (`Review` links to a `Provider`, not a `Service` — see
  /// `HttpSearchRepository`'s doc comment).
  Future<double> ratingOf(ProviderId providerId);

  /// Real count of `Review` records for [providerId].
  Future<int> reviewsCountOf(ProviderId providerId);
}
