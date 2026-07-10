import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/features/payments/repositories/mock_payments_repository.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/payment/entities/payment.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/quote/entities/quote.dart';
import 'package:mobile/service/entities/service.dart';

void main() {
  group('MockPaymentsRepository', () {
    final repository = MockPaymentsRepository();

    test('getPayment returns a real Payment entity, not a map', () {
      expect(repository.getPayment(), isA<Payment>());
    });

    test('getOrder returns a real Order entity, not a map', () {
      expect(repository.getOrder(), isA<Order>());
    });

    test('getQuote returns a real Quote entity, not a map', () {
      expect(repository.getQuote(), isA<Quote>());
    });

    test('getService returns a real Service entity, not a map', () {
      expect(repository.getService(), isA<Service>());
    });

    test('getProvider returns a real Provider entity, not a map', () {
      expect(repository.getProvider(), isA<Provider>());
    });

    test('getProfile returns a real Profile with a display name', () {
      final profile = repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('payment references the same order and quote returned', () {
      expect(repository.getPayment().orderId, equals(repository.getOrder().id));
      expect(repository.getPayment().quoteId, equals(repository.getQuote().id));
    });

    test('quote references the same order returned', () {
      expect(repository.getQuote().orderId, equals(repository.getOrder().id));
    });

    test('order and payment reference the same provider', () {
      final providerId = repository.getProvider().id;
      expect(repository.getOrder().providerId, equals(providerId));
      expect(repository.getPayment().receiverProviderId, equals(providerId));
    });

    test('is independent from every other feature mock data', () {
      expect(repository.getProvider().id.value.startsWith('payments-'), isTrue);
    });
  });
}
