import '../../../address/entities/address.dart';
import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../order/entities/order.dart';
import '../../../order/models/order_id.dart';
import '../../../order/models/order_status.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_request_service_data.dart';
import '../models/request_priority.dart';
import 'request_service_repository.dart';

/// In-memory `RequestServiceRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README.
class MockRequestServiceRepository implements RequestServiceRepository {
  @override
  Future<Service> getService() => Future.value(mockRequestServiceService);

  @override
  Future<Provider> getProvider() => Future.value(mockRequestServiceProvider);

  @override
  Future<Profile> getProfile() => Future.value(mockRequestServiceProfile);

  @override
  Future<Category> getCategory() => Future.value(mockRequestServiceCategory);

  @override
  Future<Availability> getAvailability() =>
      Future.value(mockRequestServiceAvailability);

  @override
  Future<Address> getAddress() => Future.value(mockRequestServiceAddress);

  @override
  Future<Order> createOrder({
    required Service service,
    required Provider provider,
    required String title,
    required String description,
    required DateTime scheduledDate,
    required RequestPriority priority,
  }) async {
    final now = DateTime.now();
    return Order(
      id: OrderId.create(),
      identityId: mockRequestServiceAddress.identityId,
      providerId: provider.id,
      serviceId: service.id,
      title: title,
      description: description,
      scheduledDate: scheduledDate,
      status: OrderStatus.pending,
      priority: priority.asOrderPriority,
      createdAt: now,
      updatedAt: now,
    );
  }
}
