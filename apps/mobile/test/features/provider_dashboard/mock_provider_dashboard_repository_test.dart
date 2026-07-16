import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/features/provider_dashboard/repositories/mock_provider_dashboard_repository.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/payment/entities/payment.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/quote/entities/quote.dart';
import 'package:mobile/review/entities/review.dart';

void main() {
  group('MockProviderDashboardRepository', () {
    final repository = MockProviderDashboardRepository();

    test('getProvider returns a real Provider entity, not a map', () async {
      expect(await repository.getProvider(), isA<Provider>());
    });

    test('getProfile returns a real Profile with a display name', () async {
      final profile = await repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('getOrders returns real Order entities, not maps', () async {
      final orders = await repository.getOrders();
      expect(orders, isNotEmpty);
      expect(orders, everyElement(isA<Order>()));
    });

    test('getQuotes returns real Quote entities, not maps', () async {
      final quotes = await repository.getQuotes();
      expect(quotes, isNotEmpty);
      expect(quotes, everyElement(isA<Quote>()));
    });

    test('getReviews returns real Review entities, not maps', () async {
      final reviews = await repository.getReviews();
      expect(reviews, isNotEmpty);
      expect(reviews, everyElement(isA<Review>()));
    });

    test('getPayments returns real Payment entities, not maps', () async {
      final payments = await repository.getPayments();
      expect(payments, isNotEmpty);
      expect(payments, everyElement(isA<Payment>()));
    });

    test('every order references the same provider returned', () async {
      final providerId = (await repository.getProvider()).id;
      final orders = await repository.getOrders();
      expect(orders.every((o) => o.providerId == providerId), isTrue);
    });

    test('is independent from every other feature mock data', () async {
      final provider = await repository.getProvider();
      expect(provider.id.value.startsWith('provider-dashboard-'), isTrue);
    });
  });
}
