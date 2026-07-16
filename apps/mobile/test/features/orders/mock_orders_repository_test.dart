import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/entities/category.dart';
import 'package:mobile/features/orders/repositories/mock_orders_repository.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/quote/entities/quote.dart';
import 'package:mobile/service/entities/service.dart';

void main() {
  group('MockOrdersRepository', () {
    final repository = MockOrdersRepository();

    test('getOrders returns real Order entities, not maps', () async {
      final orders = await repository.getOrders();
      expect(orders, isNotEmpty);
      expect(orders, everyElement(isA<Order>()));
    });

    test('returns one order per status the UI needs to distinguish', () async {
      final orders = await repository.getOrders();
      final statuses = orders.map((o) => o.status).toSet();
      expect(statuses.length, equals(orders.length));
    });

    test('getServiceFor returns a real Service entity, not a map', () async {
      final order = (await repository.getOrders()).first;
      expect(await repository.getServiceFor(order), isA<Service>());
    });

    test('getProviderFor returns a real Provider entity, not a map', () async {
      final order = (await repository.getOrders()).first;
      expect(await repository.getProviderFor(order), isA<Provider>());
    });

    test('getProfileFor returns a real Profile with a display name', () async {
      final order = (await repository.getOrders()).first;
      final profile = await repository.getProfileFor(order);
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getCategoryFor returns a real Category entity, not a map', () async {
      final order = (await repository.getOrders()).first;
      expect(await repository.getCategoryFor(order), isA<Category>());
    });

    test('getQuoteFor returns a real Quote entity, not a map', () async {
      final order = (await repository.getOrders()).first;
      expect(await repository.getQuoteFor(order), isA<Quote>());
    });

    test('every order service references the same category returned', () async {
      for (final order in await repository.getOrders()) {
        final service = await repository.getServiceFor(order);
        final category = await repository.getCategoryFor(order);
        expect(service.categoryId, equals(category.id));
      }
    });

    test('every order quote references the order itself', () async {
      for (final order in await repository.getOrders()) {
        final quote = await repository.getQuoteFor(order);
        expect(quote.orderId, equals(order.id));
      }
    });

    test('is independent from every other feature mock data', () async {
      final orders = await repository.getOrders();
      expect(
        orders.every((order) => order.id.value.startsWith('orders-')),
        isTrue,
      );
    });
  });
}
