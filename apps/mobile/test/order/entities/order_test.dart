import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/address/models/address_id.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/order/models/order_id.dart';
import 'package:mobile/order/models/order_status.dart';
import 'package:mobile/order/models/order_priority.dart';
import 'package:mobile/category/models/category_id.dart';
import 'package:mobile/identity/models/identity_id.dart';
import 'package:mobile/provider/models/provider_id.dart';
import 'package:mobile/service/models/service_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = OrderId.create();
    final identityId = IdentityId.create();
    final providerId = ProviderId.create();
    final serviceId = ServiceId.create();
    final addressId = AddressId.create();
    final now = DateTime(2026, 1, 1);
    final order = Order(
      id: id,
      identityId: identityId,
      categoryId: CategoryId.create(),
      providerId: providerId,
      serviceId: serviceId,
      addressId: addressId,
      title: 'Destape urgente',
      description: 'Tubería obstruida en la cocina',
      scheduledDate: DateTime(2026, 2, 1),
      status: OrderStatus.pending,
      priority: OrderPriority.urgent,
      createdAt: now,
      updatedAt: now,
    );

    expect(order.id, id);
    expect(order.identityId, identityId);
    expect(order.providerId, providerId);
    expect(order.serviceId, serviceId);
    expect(order.addressId, addressId);
    expect(order.title, 'Destape urgente');
    expect(order.status, OrderStatus.pending);
    expect(order.priority, OrderPriority.urgent);
  });

  test('is equal to another order with the same id', () {
    final id = OrderId.create();
    final identityId = IdentityId.create();
    final providerId = ProviderId.create();
    final serviceId = ServiceId.create();
    final addressId = AddressId.create();
    final now = DateTime(2026, 1, 1);
    Order build() => Order(
      id: id,
      identityId: identityId,
      categoryId: CategoryId.create(),
      providerId: providerId,
      serviceId: serviceId,
      addressId: addressId,
      title: 'Servicio',
      description: 'Desc',
      scheduledDate: now,
      status: OrderStatus.pending,
      priority: OrderPriority.medium,
      createdAt: now,
      updatedAt: now,
    );

    expect(build(), equals(build()));
  });
}
