import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';

/// Local (on-device) source for the domain entities a Provider
/// Profile screen needs. No implementation — see `PROJECT_STATUS.md`
/// (Sprint 2, Etapa 6).
abstract class ProviderProfileLocalDataSource {
  Provider getProvider();
  Profile getProfile();
  Availability getAvailability();
  List<Review> getReviews();
  List<Service> getServices();
  List<Category> getCategories();
}
