import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';

/// Remote (API/Firebase) source for the domain entities a Service
/// Detail screen needs. No implementation — see `PROJECT_STATUS.md`
/// (Sprint 2, Etapa 6).
abstract class ServiceDetailRemoteDataSource {
  Future<Service> getService();
  Future<Provider> getProvider();
  Future<Profile> getProviderProfile();
  Future<Category> getCategory();
  Future<List<Review>> getReviews();
}
