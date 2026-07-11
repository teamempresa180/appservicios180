import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';

/// Remote (API/Firebase) source for the domain entities a Provider
/// Profile screen needs. No implementation — see `PROJECT_STATUS.md`
/// (Sprint 2, Etapa 6).
abstract class ProviderProfileRemoteDataSource {
  Future<Provider> getProvider();
  Future<Profile> getProfile();
  Future<Availability> getAvailability();
  Future<List<Review>> getReviews();
  Future<List<Service>> getServices();
  Future<List<Category>> getCategories();
}
