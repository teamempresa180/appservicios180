import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/features/notifications/repositories/mock_notifications_repository.dart';
import 'package:mobile/notification/entities/notification.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/payment/entities/payment.dart';
import 'package:mobile/quote/entities/quote.dart';
import 'package:mobile/chat/entities/chat.dart';

void main() {
  group('MockNotificationsRepository', () {
    final repository = MockNotificationsRepository();

    test('getNotifications returns real Notification entities, not maps', () {
      final notifications = repository.getNotifications();
      expect(notifications, isNotEmpty);
      expect(notifications, everyElement(isA<Notification>()));
    });

    test(
      'returns one notification per category the UI needs to distinguish',
      () {
        expect(repository.getNotifications().length, equals(5));
      },
    );

    test('exactly one notification is paired with a real Order', () {
      final matches = repository.getNotifications().where(
        (n) => repository.getOrderFor(n) != null,
      );
      expect(matches.length, equals(1));
      expect(repository.getOrderFor(matches.first), isA<Order>());
    });

    test('exactly one notification is paired with a real Payment', () {
      final matches = repository.getNotifications().where(
        (n) => repository.getPaymentFor(n) != null,
      );
      expect(matches.length, equals(1));
      expect(repository.getPaymentFor(matches.first), isA<Payment>());
    });

    test('exactly one notification is paired with a real Quote', () {
      final matches = repository.getNotifications().where(
        (n) => repository.getQuoteFor(n) != null,
      );
      expect(matches.length, equals(1));
      expect(repository.getQuoteFor(matches.first), isA<Quote>());
    });

    test('exactly one notification is paired with a real Chat', () {
      final matches = repository.getNotifications().where(
        (n) => repository.getChatFor(n) != null,
      );
      expect(matches.length, equals(1));
      expect(repository.getChatFor(matches.first), isA<Chat>());
    });

    test('at least one notification has no related entity (system)', () {
      final systemOnly = repository.getNotifications().where(
        (n) =>
            repository.getOrderFor(n) == null &&
            repository.getPaymentFor(n) == null &&
            repository.getQuoteFor(n) == null &&
            repository.getChatFor(n) == null,
      );
      expect(systemOnly.length, equals(1));
    });

    test('is independent from every other feature mock data', () {
      expect(
        repository.getNotifications().every(
          (n) => n.id.value.startsWith('notifications-'),
        ),
        isTrue,
      );
    });
  });
}
