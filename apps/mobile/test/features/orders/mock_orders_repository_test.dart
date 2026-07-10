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

    test('getOrders returns real Order entities, not maps', () {
      final orders = repository.getOrders();
      expect(orders, isNotEmpty);
      expect(orders, everyElement(isA<Order>()));
    });

    test('returns one order per status the UI needs to distinguish', () {
      final statuses = repository.getOrders().map((o) => o.status).toSet();
      expect(statuses.length, equals(repository.getOrders().length));
    });

    test('getServiceFor returns a real Service entity, not a map', () {
      final order = repository.getOrders().first;
      expect(repository.getServiceFor(order), isA<Service>());
    });

    test('getProviderFor returns a real Provider entity, not a map', () {
      final order = repository.getOrders().first;
      expect(repository.getProviderFor(order), isA<Provider>());
    });

    test('getProfileFor returns a real Profile with a display name', () {
      final order = repository.getOrders().first;
      final profile = repository.getProfileFor(order);
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getCategoryFor returns a real Category entity, not a map', () {
      final order = repository.getOrders().first;
      expect(repository.getCategoryFor(order), isA<Category>());
    });

    test('getQuoteFor returns a real Quote entity, not a map', () {
      final order = repository.getOrders().first;
      expect(repository.getQuoteFor(order), isA<Quote>());
    });

    test('every order service references the same category returned', () {
      for (final order in repository.getOrders()) {
        expect(
          repository.getServiceFor(order).categoryId,
          equals(repository.getCategoryFor(order).id),
        );
      }
    });

    test('every order quote references the order itself', () {
      for (final order in repository.getOrders()) {
        expect(repository.getQuoteFor(order).orderId, equals(order.id));
      }
    });

    test('is independent from every other feature mock data', () {
      expect(
        repository.getOrders().every(
          (order) => order.id.value.startsWith('orders-'),
        ),
        isTrue,
      );
    });
  });
}
