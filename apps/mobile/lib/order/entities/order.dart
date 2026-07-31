import '../../address/models/address_id.dart';
import '../../core/base/entity.dart';
import '../../category/models/category_id.dart';
import '../../identity/models/identity_id.dart';
import '../../provider/models/provider_id.dart';
import '../../service/models/service_id.dart';
import '../models/order_id.dart';
import '../models/order_status.dart';
import '../models/order_priority.dart';

/// Represents a customer's request for a service from a provider.
/// Pure data holder — no payments, no chat, no scheduling logic, no
/// tracking, no reviews, no notifications, no persistence, no business rules.
///
/// [categoryId] is always present — every order belongs to a category.
/// [providerId]/[serviceId] are **both nullable together**: a direct
/// hire (client picked a specific provider + service) carries both; an
/// open request (client only picked a category) carries neither at
/// creation. Accepting a `Quote` for an open request assigns
/// [providerId] server-side — see `copyWith`'s `providerId` parameter.
/// `serviceId` has no equivalent assignment moment: a `Quote` carries
/// no `serviceId` of its own, so an open request's [serviceId] may stay
/// `null` for its whole lifecycle.
class Order extends Entity<OrderId> {
  const Order({
    required OrderId id,
    required this.identityId,
    required this.categoryId,
    required this.providerId,
    required this.serviceId,
    required this.addressId,
    required this.title,
    required this.description,
    required this.scheduledDate,
    required this.status,
    required this.priority,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final IdentityId identityId;
  final CategoryId categoryId;
  final ProviderId? providerId;
  final ServiceId? serviceId;
  final AddressId? addressId;
  final String title;
  final String description;
  final DateTime scheduledDate;
  final OrderStatus status;
  final OrderPriority priority;
  final DateTime createdAt;
  final DateTime updatedAt;

  /// `true` when this order was created against a specific provider (and
  /// service) instead of just a category — see the class doc.
  bool get isDirectHire => providerId != null && serviceId != null;

  Order copyWith({
    OrderStatus? status,
    ProviderId? providerId,
    AddressId? addressId,
  }) {
    return Order(
      id: id,
      identityId: identityId,
      categoryId: categoryId,
      providerId: providerId ?? this.providerId,
      serviceId: serviceId,
      addressId: addressId ?? this.addressId,
      title: title,
      description: description,
      scheduledDate: scheduledDate,
      status: status ?? this.status,
      priority: priority,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}
