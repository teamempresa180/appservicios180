import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/chat/entities/chat.dart';
import 'package:mobile/features/notifications/repositories/mock_notifications_repository.dart';
import 'package:mobile/notification/entities/notification.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/payment/entities/payment.dart';
import 'package:mobile/quote/entities/quote.dart';

void main() {
  group('MockNotificationsRepository', () {
    final repository = MockNotificationsRepository();

    test(
      'getNotifications returns real Notification entities, not maps',
      () async {
        final notifications = await repository.getNotifications();
        expect(notifications, isNotEmpty);
        expect(notifications, everyElement(isA<Notification>()));
      },
    );

    test(
      'returns one notification per category the UI needs to distinguish',
      () async {
        expect((await repository.getNotifications()).length, equals(5));
      },
    );

    test('exactly one notification is paired with a real Order', () async {
      final notifications = await repository.getNotifications();
      final matches = <Notification>[];
      for (final n in notifications) {
        if (await repository.getOrderFor(n) != null) matches.add(n);
      }
      expect(matches.length, equals(1));
      expect(await repository.getOrderFor(matches.first), isA<Order>());
    });

    test('exactly one notification is paired with a real Payment', () async {
      final notifications = await repository.getNotifications();
      final matches = <Notification>[];
      for (final n in notifications) {
        if (await repository.getPaymentFor(n) != null) matches.add(n);
      }
      expect(matches.length, equals(1));
      expect(await repository.getPaymentFor(matches.first), isA<Payment>());
    });

    test('exactly one notification is paired with a real Quote', () async {
      final notifications = await repository.getNotifications();
      final matches = <Notification>[];
      for (final n in notifications) {
        if (await repository.getQuoteFor(n) != null) matches.add(n);
      }
      expect(matches.length, equals(1));
      expect(await repository.getQuoteFor(matches.first), isA<Quote>());
    });

    test('exactly one notification is paired with a real Chat', () async {
      final notifications = await repository.getNotifications();
      final matches = <Notification>[];
      for (final n in notifications) {
        if (await repository.getChatFor(n) != null) matches.add(n);
      }
      expect(matches.length, equals(1));
      expect(await repository.getChatFor(matches.first), isA<Chat>());
    });

    test('at least one notification has no related entity (system)', () async {
      final notifications = await repository.getNotifications();
      var systemOnlyCount = 0;
      for (final n in notifications) {
        final hasAny =
            await repository.getOrderFor(n) != null ||
            await repository.getPaymentFor(n) != null ||
            await repository.getQuoteFor(n) != null ||
            await repository.getChatFor(n) != null;
        if (!hasAny) systemOnlyCount++;
      }
      expect(systemOnlyCount, equals(1));
    });

    test('is independent from every other feature mock data', () async {
      final notifications = await repository.getNotifications();
      expect(
        notifications.every((n) => n.id.value.startsWith('notifications-')),
        isTrue,
      );
    });
  });
}
