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
  Provider getProvider() => mockProviderProfileProvider;

  @override
  Profile getProfile() => mockProviderProfileProfile;

  @override
  Availability getAvailability() => mockProviderProfileAvailability;

  @override
  List<Review> getReviews() => List.unmodifiable(mockProviderProfileReviews);

  @override
  List<Service> getServices() => List.unmodifiable(mockProviderProfileServices);

  @override
  List<Category> getCategories() =>
      List.unmodifiable(mockProviderProfileCategories);
}
