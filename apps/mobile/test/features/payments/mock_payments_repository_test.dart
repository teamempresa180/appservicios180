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

    test('getPayment returns a real Payment entity, not a map', () async {
      expect(await repository.getPayment(), isA<Payment>());
    });

    test('getOrder returns a real Order entity, not a map', () async {
      expect(await repository.getOrder(), isA<Order>());
    });

    test('getPaymentFor returns a real Payment entity regardless of order', () async {
      final order = await repository.getOrder();
      expect(await repository.getPaymentFor(order), isA<Payment>());
    });

    test('getQuoteFor returns a real Quote entity, not a map', () async {
      final payment = await repository.getPayment();
      expect(await repository.getQuoteFor(payment), isA<Quote>());
    });

    test('getServiceFor returns a real Service entity, not a map', () async {
      final order = await repository.getOrder();
      expect(await repository.getServiceFor(order), isA<Service>());
    });

    test('getProviderFor returns a real Provider entity, not a map', () async {
      final payment = await repository.getPayment();
      expect(await repository.getProviderFor(payment), isA<Provider>());
    });

    test('getProfileFor returns a real Profile with a display name', () async {
      final payment = await repository.getPayment();
      final provider = await repository.getProviderFor(payment);
      final profile = await repository.getProfileFor(provider);
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('payment references the same order and quote returned', () async {
      final payment = await repository.getPayment();
      expect(
        payment.orderId,
        equals((await repository.getOrder()).id),
      );
      expect(
        payment.quoteId,
        equals((await repository.getQuoteFor(payment)).id),
      );
    });

    test('quote references the same order returned', () async {
      final payment = await repository.getPayment();
      expect(
        (await repository.getQuoteFor(payment)).orderId,
        equals((await repository.getOrder()).id),
      );
    });

    test('order and payment reference the same provider', () async {
      final payment = await repository.getPayment();
      final providerId = (await repository.getProviderFor(payment)).id;
      expect((await repository.getOrder()).providerId, equals(providerId));
      expect(payment.receiverProviderId, equals(providerId));
    });

    test('is independent from every other feature mock data', () async {
      final payment = await repository.getPayment();
      expect(
        (await repository.getProviderFor(payment)).id.value.startsWith(
          'payments-',
        ),
        isTrue,
      );
    });
  });
}
