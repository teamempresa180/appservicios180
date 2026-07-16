import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_service_detail_data.dart';
import 'service_detail_repository.dart';

/// In-memory `ServiceDetailRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README.
class MockServiceDetailRepository implements ServiceDetailRepository {
  @override
  Future<Service> getService() => Future.value(mockServiceDetailService);

  @override
  Future<Provider> getProvider() => Future.value(mockServiceDetailProvider);

  @override
  Future<Profile> getProviderProfile() =>
      Future.value(mockServiceDetailProfile);

  @override
  Future<Category> getCategory() => Future.value(mockServiceDetailCategory);

  @override
  Future<List<Review>> getReviews() =>
      Future.value(List.unmodifiable(mockServiceDetailReviews));
}
