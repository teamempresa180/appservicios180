import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_provider_profile_data.dart';
import 'provider_profile_repository.dart';

/// In-memory `ProviderProfileRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README.
class MockProviderProfileRepository implements ProviderProfileRepository {
  @override
  Future<Provider> getProvider() => Future.value(mockProviderProfileProvider);

  @override
  Future<Profile> getProfile() => Future.value(mockProviderProfileProfile);

  @override
  Future<Availability> getAvailability() =>
      Future.value(mockProviderProfileAvailability);

  @override
  Future<List<Review>> getReviews() =>
      Future.value(List.unmodifiable(mockProviderProfileReviews));

  @override
  Future<List<Service>> getServices() =>
      Future.value(List.unmodifiable(mockProviderProfileServices));

  @override
  Future<List<Category>> getCategories() =>
      Future.value(List.unmodifiable(mockProviderProfileCategories));
}
