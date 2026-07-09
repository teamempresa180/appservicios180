import '../../core/base/entity.dart';
import '../../identity/models/identity_id.dart';
import '../../provider/models/provider_id.dart';
import '../../service/models/service_id.dart';
import '../models/order_id.dart';
import '../models/order_status.dart';
import '../models/order_priority.dart';

/// Represents a customer's request for a service from a provider.
/// Pure data holder — no payments, no chat, no scheduling logic, no
/// tracking, no reviews, no notifications, no persistence, no business rules.
class Order extends Entity<OrderId> {
  const Order({
    required OrderId id,
    required this.identityId,
    required this.providerId,
    required this.serviceId,
    required this.title,
    required this.description,
    required this.scheduledDate,
    required this.status,
    required this.priority,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final IdentityId identityId;
  final ProviderId providerId;
  final ServiceId serviceId;
  final String title;
  final String description;
  final DateTime scheduledDate;
  final OrderStatus status;
  final OrderPriority priority;
  final DateTime createdAt;
  final DateTime updatedAt;
}
