import 'dart:async';

import 'package:flutter/material.dart' hide Notification;
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/chat/entities/chat.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_chip.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/notifications/presentation/pages/notifications_page.dart';
import 'package:mobile/features/notifications/presentation/widgets/notification_card.dart';
import 'package:mobile/features/notifications/presentation/widgets/notification_filter_tabs.dart';
import 'package:mobile/features/notifications/repositories/mock_notifications_repository.dart';
import 'package:mobile/features/notifications/repositories/notifications_repository.dart';
import 'package:mobile/notification/entities/notification.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/payment/entities/payment.dart';
import 'package:mobile/quote/entities/quote.dart';

/// Wraps [MockNotificationsRepository] (already `Future`-returning) so
/// tests can force it to never resolve (loading state) or return an
/// empty list (empty state), without touching the real mock data.
class _FakeNotificationsRepository implements NotificationsRepository {
  _FakeNotificationsRepository({
    this.neverResolves = false,
    this.forceEmpty = false,
  });

  final bool neverResolves;
  final bool forceEmpty;
  final _delegate = MockNotificationsRepository();

  @override
  Future<List<Notification>> getNotifications() {
    if (neverResolves) return Completer<List<Notification>>().future;
    if (forceEmpty) return Future.value(const []);
    return _delegate.getNotifications();
  }

  @override
  Future<Order?> getOrderFor(Notification notification) =>
      _delegate.getOrderFor(notification);

  @override
  Future<Payment?> getPaymentFor(Notification notification) =>
      _delegate.getPaymentFor(notification);

  @override
  Future<Quote?> getQuoteFor(Notification notification) =>
      _delegate.getQuoteFor(notification);

  @override
  Future<Chat?> getChatFor(Notification notification) =>
      _delegate.getChatFor(notification);
}

void main() {
  Widget buildApp({NotificationsRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: NotificationsPage(
          repository: repository ?? _FakeNotificationsRepository(),
        ),
      ),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Notificaciones'), findsOneWidget);
  });

  testWidgets('shows the five filter tabs', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(NotificationFilterTabs), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'Todas'), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'No leídas'), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'Pedidos'), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'Pagos'), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'Mensajes'), findsOneWidget);
  });

  testWidgets('selecting "No leídas" filters the list to unread only', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    final chipBefore = tester.widget<AppChip>(
      find.widgetWithText(AppChip, 'No leídas'),
    );
    expect(chipBefore.selected, isFalse);

    await tester.tap(find.text('No leídas'));
    await tester.pumpAndSettle();

    final chipAfter = tester.widget<AppChip>(
      find.widgetWithText(AppChip, 'No leídas'),
    );
    expect(chipAfter.selected, isTrue);
    // 3 of the 5 mock notifications are unread (order/quote/chat) — see
    // `mock_notifications_data.dart`.
    expect(find.byType(NotificationCard), findsNWidgets(3));
    expect(find.text('Pago completado'), findsNothing);
    expect(find.text('Bienvenido a AppServicios'), findsNothing);
  });

  testWidgets('selecting "Pedidos" filters the list to order notifications', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('Pedidos'));
    await tester.pumpAndSettle();

    expect(find.byType(NotificationCard), findsNWidgets(1));
    expect(find.text('Tu orden fue aceptada'), findsOneWidget);
  });

  testWidgets('list state shows every mock notification', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(NotificationCard), findsNWidgets(5));
    expect(find.text('Tu orden fue aceptada'), findsOneWidget);
    expect(find.text('Pago completado'), findsOneWidget);
    expect(find.text('Nueva cotización disponible'), findsOneWidget);
    expect(find.text('Nuevo mensaje de Diana Restrepo'), findsOneWidget);
    expect(find.text('Bienvenido a AppServicios'), findsOneWidget);
  });

  testWidgets('shows the category-dependent action per notification', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Ver orden'), findsOneWidget);
    expect(find.text('Ver pago'), findsOneWidget);
    expect(find.text('Ver cotización'), findsOneWidget);
    expect(find.text('Ver mensaje'), findsOneWidget);
    expect(find.text('Ver más'), findsOneWidget);
  });

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeNotificationsRepository(neverResolves: true)),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(NotificationCard), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeNotificationsRepository(forceEmpty: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(NotificationCard), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
