import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_search_data.dart';
import 'search_repository.dart';

/// In-memory `SearchRepository` backed by fixed mock data. No backend,
/// no persistence, no network, no real search — see the feature README.
class MockSearchRepository implements SearchRepository {
  @override
  Future<List<Service>> getAll() =>
      Future.value(List.unmodifiable(mockSearchServices));

  @override
  Future<Provider> providerOf(ProviderId id) => Future.value(
    mockSearchProviders.firstWhere((provider) => provider.id == id),
  );

  @override
  Future<Category> categoryOf(CategoryId id) => Future.value(
    mockSearchCategories.firstWhere((category) => category.id == id),
  );

  @override
  Future<double> ratingOf(ProviderId providerId) =>
      Future.value(mockSearchRatings[providerId.value] ?? 4.5);

  @override
  Future<int> reviewsCountOf(ProviderId providerId) =>
      Future.value(mockSearchReviewsCount[providerId.value] ?? 0);
}
