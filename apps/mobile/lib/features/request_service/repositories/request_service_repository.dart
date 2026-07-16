import '../../../address/entities/address.dart';
import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';

/// Contract for reading the domain entities a Request Service screen
/// needs. Returns only real domain entities — no `Map`, no `dynamic`.
/// Implemented today by `MockRequestServiceRepository`; a future
/// `ApiRequestServiceRepository` or `FirebaseRequestServiceRepository`
/// would implement this same interface (see the feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// service/provider (see the feature README for why).
abstract class RequestServiceRepository {
  Future<Service> getService();
  Future<Provider> getProvider();
  Future<Profile> getProfile();
  Future<Category> getCategory();
  Future<Availability> getAvailability();
  Future<Address> getAddress();
}
