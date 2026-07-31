import '../../../address/entities/address.dart';
import '../../../address/models/address_id.dart';
import '../../../category/models/category_id.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/session/session_manager.dart';
import '../../../order/entities/order.dart';
import '../../../provider/models/provider_id.dart';
import '../../../service/models/service_id.dart';
import '../models/request_priority.dart';
import 'request_service_repository.dart';

/// [RequestServiceRepository] backed by [ApiClient].
///
/// `getAddress` has no domain relation to a service request at all (a
/// request isn't identity-scoped at this interface) — it fetches
/// `GET /addresses` and simply takes the first item. This is
/// arbitrary/simulated-equivalent, documented here rather than silently
/// picked: there is genuinely no domain link to resolve instead.
///
/// `createOrder` sends `providerId`/`serviceId` only when both are
/// given (a direct hire) — omitting both altogether for an open
/// request, matching `POST /orders`'s real contract.
class HttpRequestServiceRepository implements RequestServiceRepository {
  HttpRequestServiceRepository(this._apiClient, this._sessionManager);

  final ApiClient _apiClient;
  final SessionManager _sessionManager;

  @override
  Future<Address> getAddress() async {
    final json = await _apiClient.get('/addresses');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    if (items.isEmpty) {
      throw StateError('No addresses available for the current session');
    }
    return AddressHttpMapper.fromJson(items.first);
  }

  @override
  Future<Order> createOrder({
    required CategoryId categoryId,
    ProviderId? providerId,
    ServiceId? serviceId,
    AddressId? addressId,
    required String title,
    required String description,
    required DateTime scheduledDate,
    required RequestPriority priority,
  }) async {
    final json = await _apiClient.post(
      '/orders',
      data: {
        'identityId': _sessionManager.currentUserId,
        'categoryId': categoryId.value,
        if (providerId != null) 'providerId': providerId.value,
        if (serviceId != null) 'serviceId': serviceId.value,
        if (addressId != null) 'addressId': addressId.value,
        'title': title,
        'description': description,
        'scheduledDate': scheduledDate.toIso8601String(),
        'priority': priority.asOrderPriority.name.toUpperCase(),
      },
    );
    return OrderHttpMapper.fromJson(json);
  }
}
