import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/address/entities/address.dart';
import 'package:mobile/category/models/category_id.dart';
import 'package:mobile/features/request_service/models/request_priority.dart';
import 'package:mobile/features/request_service/repositories/mock_request_service_repository.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/provider/models/provider_id.dart';
import 'package:mobile/service/models/service_id.dart';

void main() {
  group('MockRequestServiceRepository', () {
    final repository = MockRequestServiceRepository();

    test('getAddress returns a real Address entity, not a map', () async {
      expect(await repository.getAddress(), isA<Address>());
    });

    test('createOrder returns a real Order for a direct hire', () async {
      final categoryId = CategoryId.create();
      final providerId = ProviderId.create();
      final serviceId = ServiceId.create();
      final order = await repository.createOrder(
        categoryId: categoryId,
        providerId: providerId,
        serviceId: serviceId,
        title: 'Reparación',
        description: 'Descripción',
        scheduledDate: DateTime(2026, 1, 10, 10, 0),
        priority: RequestPriority.normal,
      );

      expect(order, isA<Order>());
      expect(order.categoryId, categoryId);
      expect(order.providerId, providerId);
      expect(order.serviceId, serviceId);
      expect(order.isDirectHire, isTrue);
    });

    test('createOrder returns an open request when provider/service are omitted', () async {
      final categoryId = CategoryId.create();
      final order = await repository.createOrder(
        categoryId: categoryId,
        title: 'Reparación',
        description: 'Descripción',
        scheduledDate: DateTime(2026, 1, 10, 10, 0),
        priority: RequestPriority.normal,
      );

      expect(order.categoryId, categoryId);
      expect(order.providerId, isNull);
      expect(order.serviceId, isNull);
      expect(order.isDirectHire, isFalse);
    });
  });
}
