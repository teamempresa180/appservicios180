import '../../../address/entities/address.dart';
import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';
import '../models/request_priority.dart';

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

  /// Submits the request as a real `Order` (`POST /orders` on the real
  /// backend) — this is the action "Continuar" performs.
  Future<Order> createOrder({
    required Service service,
    required Provider provider,
    required String title,
    required String description,
    required DateTime scheduledDate,
    required RequestPriority priority,
  });
}
