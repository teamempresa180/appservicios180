import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';
// Deliberate exception to "each feature owns independent mock data":
// resolving a *real* service (tapped from Marketplace/Search) to its
// actual provider/category needs the same mock universe those features
// already seed — reusing it here is what makes id-based lookup
// genuinely correct in mock/offline mode too, not just against the real
// backend.
import '../../marketplace/mock/mock_categories_data.dart';
import '../../marketplace/mock/mock_providers_data.dart';
import '../mock/mock_service_detail_data.dart';
import 'service_detail_repository.dart';

/// In-memory `ServiceDetailRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README.
class MockServiceDetailRepository implements ServiceDetailRepository {
  @override
  Future<Service> getService() => Future.value(mockServiceDetailService);

  @override
  Future<Provider> getProviderFor(Service service) => Future.value(
    mockProviders.firstWhere(
      (provider) => provider.id == service.providerId,
      orElse: () => mockServiceDetailProvider,
    ),
  );

  @override
  Future<Profile> getProviderProfileFor(Provider provider) => Future.value(
    mockProviderProfiles.firstWhere(
      (profile) => profile.id == provider.providerProfileId,
      orElse: () => mockServiceDetailProfile,
    ),
  );

  @override
  Future<Category> getCategoryFor(Service service) => Future.value(
    mockCategories.firstWhere(
      (category) => category.id == service.categoryId,
      orElse: () => mockServiceDetailCategory,
    ),
  );

  // `Review` has no `serviceId` field (only `orderId`/`providerId`), so
  // this stays the fixed mock set regardless of which service was
  // passed — same limitation `HttpServiceDetailRepository` documents.
  @override
  Future<List<Review>> getReviewsFor(Service service) =>
      Future.value(List.unmodifiable(mockServiceDetailReviews));
}
