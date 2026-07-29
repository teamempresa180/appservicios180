import '../../../address/entities/address.dart';
import '../../../category/models/category_id.dart';
import '../../../order/entities/order.dart';
import '../../../order/models/order_id.dart';
import '../../../order/models/order_status.dart';
import '../../../provider/models/provider_id.dart';
import '../../../service/models/service_id.dart';
import '../mock/mock_request_service_data.dart';
import '../models/request_priority.dart';
import 'request_service_repository.dart';

/// In-memory `RequestServiceRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README.
class MockRequestServiceRepository implements RequestServiceRepository {
  @override
  Future<Address> getAddress() => Future.value(mockRequestServiceAddress);

  @override
  Future<Order> createOrder({
    required CategoryId categoryId,
    ProviderId? providerId,
    ServiceId? serviceId,
    required String title,
    required String description,
    required DateTime scheduledDate,
    required RequestPriority priority,
  }) async {
    final now = DateTime.now();
    return Order(
      id: OrderId.create(),
      identityId: mockRequestServiceAddress.identityId,
      categoryId: categoryId,
      providerId: providerId,
      serviceId: serviceId,
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
