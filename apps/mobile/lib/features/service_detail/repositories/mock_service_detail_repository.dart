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
  Service getService() => mockServiceDetailService;

  @override
  Provider getProvider() => mockServiceDetailProvider;

  @override
  Profile getProviderProfile() => mockServiceDetailProfile;

  @override
  Category getCategory() => mockServiceDetailCategory;

  @override
  List<Review> getReviews() => List.unmodifiable(mockServiceDetailReviews);
}
