import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/entities/category.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_chip.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/core/ui/widgets/order_progress.dart';
import 'package:mobile/features/orders/presentation/pages/orders_page.dart';
import 'package:mobile/features/orders/presentation/widgets/order_card.dart';
import 'package:mobile/features/orders/presentation/widgets/order_status_tabs.dart';
import 'package:mobile/features/orders/repositories/mock_orders_repository.dart';
import 'package:mobile/features/orders/repositories/orders_repository.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';
import 'package:mobile/features/reviews/repositories/mock_reviews_repository.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/order/models/order_status.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/quote/entities/quote.dart';
import 'package:mobile/quote/models/quote_type.dart';
import 'package:mobile/service/entities/service.dart';

/// Wraps [MockOrdersRepository] (already `Future`-returning) so tests
/// can force it to never resolve (loading state) or return an empty
/// list (empty state), without touching the real mock data.
class _FakeOrdersRepository implements OrdersRepository {
  _FakeOrdersRepository({
    this.neverResolves = false,
    this.forceEmpty = false,
    this.onlyPending = false,
  });

  final bool neverResolves;
  final bool forceEmpty;

  /// Keeps only the pending mock order, so a *non-empty* order list can
  /// still leave a given status tab empty — the case the per-tab empty
  /// state exists for.
  final bool onlyPending;
  final _delegate = MockOrdersRepository();

  @override
  Future<List<Order>> getOrders({CancelToken? cancelToken}) async {
    if (neverResolves) return Completer<List<Order>>().future;
    if (forceEmpty) return const [];
    final orders = await _delegate.getOrders(cancelToken: cancelToken);
    if (!onlyPending) return orders;
    return orders
        .where((order) => order.status == OrderStatus.pending)
        .toList();
  }

  @override
  Future<Service> getServiceFor(Order order, {CancelToken? cancelToken}) =>
      _delegate.getServiceFor(order, cancelToken: cancelToken);

  @override
  Future<Provider> getProviderFor(Order order, {CancelToken? cancelToken}) =>
      _delegate.getProviderFor(order, cancelToken: cancelToken);

  @override
  Future<Profile> getProfileFor(Order order, {CancelToken? cancelToken}) =>
      _delegate.getProfileFor(order, cancelToken: cancelToken);

  @override
  Future<Category> getCategoryFor(Order order, {CancelToken? cancelToken}) =>
      _delegate.getCategoryFor(order, cancelToken: cancelToken);

  @override
  Future<Quote> getQuoteFor(Order order, {CancelToken? cancelToken}) =>
      _delegate.getQuoteFor(order, cancelToken: cancelToken);

  @override
  Future<Profile> getClientProfileFor(Order order) =>
      _delegate.getClientProfileFor(order);

  @override
  Future<Order> rejectOrder(Order order) => _delegate.rejectOrder(order);

  @override
  Future<Order> cancelOrder(Order order) => _delegate.cancelOrder(order);

  @override
  Future<List<Order>> getRelevantOrders() => _delegate.getRelevantOrders();

  @override
  Future<Provider> getCurrentProvider() => _delegate.getCurrentProvider();

  @override
  Future<Quote?> getMyQuoteFor(Order order, Provider provider) =>
      _delegate.getMyQuoteFor(order, provider);

  @override
  Future<Quote> submitQuote({
    required Order order,
    required Provider provider,
    required num proposedPrice,
    required int estimatedDuration,
    required String notes,
    required QuoteType type,
  }) => _delegate.submitQuote(
    order: order,
    provider: provider,
    proposedPrice: proposedPrice,
    estimatedDuration: estimatedDuration,
    notes: notes,
    type: type,
  );

  @override
  Future<Order> startOrder(Order order) => _delegate.startOrder(order);

  @override
  Future<Order> completeOrder(Order order) => _delegate.completeOrder(order);
}

void main() {
  Widget buildApp({OrdersRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: OrdersPage(
          repository: repository ?? _FakeOrdersRepository(),
          // `MockOrdersRepository`'s fixed orders (`orders-order-*`) share
          // no ids with either mock's own fixtures (`quote-order-1`,
          // `reviews-order-*`) — a deliberate, documented pattern in this
          // codebase (each feature's mock data is independent) that also
          // makes each order's derived `ClientOrderJourney` deterministic
          // here: no quotes are ever found, no review is ever found.
          quoteRepository: MockQuoteRepository(),
          reviewsRepository: MockReviewsRepository(),
        ),
      ),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Mis órdenes'), findsOneWidget);
  });

  testWidgets('shows every status tab with its real count', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(OrderStatusTabs), findsOneWidget);
    // The four mock orders are one per status, so every tab but "Todas"
    // holds exactly one — the counts come from the real loaded list.
    expect(find.widgetWithText(AppChip, 'Todas (4)'), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'Pendientes (1)'), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'En progreso (1)'), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'Finalizadas (1)'), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'Canceladas (1)'), findsOneWidget);
  });

  testWidgets('selecting a tab filters the list to that status', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    // Defaults to "Todas" so a client never lands on a tab that hides
    // the order they just created.
    expect(find.byType(OrderCard), findsNWidgets(4));
    final chipBefore = tester.widget<AppChip>(
      find.widgetWithText(AppChip, 'Finalizadas (1)'),
    );
    expect(chipBefore.selected, isFalse);

    await tester.tap(find.text('Finalizadas (1)'));
    await tester.pumpAndSettle();

    final chipAfter = tester.widget<AppChip>(
      find.widgetWithText(AppChip, 'Finalizadas (1)'),
    );
    expect(chipAfter.selected, isTrue);
    expect(find.byType(OrderCard), findsOneWidget);
  });

  testWidgets('an empty tab says so instead of claiming there are no orders', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeOrdersRepository(onlyPending: true)),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Finalizadas (0)'));
    await tester.pumpAndSettle();

    expect(find.byType(OrderCard), findsNothing);
    expect(find.text('Nada en "Finalizadas"'), findsOneWidget);
    expect(find.text('Sin órdenes todavía'), findsNothing);
  });

  testWidgets('list state shows every mock order with its own status', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(OrderCard), findsNWidgets(4));
    expect(find.text('Pendiente'), findsOneWidget);
    expect(find.text('En progreso'), findsWidgets);
    expect(find.text('Finalizada'), findsWidgets);
    expect(find.text('Cancelada'), findsOneWidget);
  });

  testWidgets(
    'shows the ClientOrderJourney-derived action per order, never a fixed '
    'status-only one',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      // Pending, no quotes yet (per the deterministic cross-feature mock
      // data — see `buildApp`) → awaitingQuotes → only "Cancelar
      // solicitud".
      expect(find.text('Cancelar solicitud'), findsOneWidget);
      // inProgress → only "Abrir chat".
      expect(find.text('Abrir chat'), findsOneWidget);
      // Completed, not yet reviewed → "Calificar proveedor".
      expect(find.text('Calificar proveedor'), findsOneWidget);
      // Cancelled → `ClientOrderJourney` derives zero actions — no button
      // at all for that card, per "no buttons that can't be used".
      expect(find.text('Ver información'), findsNothing);

      // None of the old, fixed-per-status labels this replaced remain.
      expect(find.text('Ver cotización'), findsNothing);
      expect(find.text('Ver detalle'), findsNothing);
      expect(find.text('Calificar'), findsNothing);
    },
  );

  testWidgets('shows the OrderProgress timeline on every card', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(OrderProgress), findsNWidgets(4));
  });

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeOrdersRepository(neverResolves: true)),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(OrderCard), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeOrdersRepository(forceEmpty: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(OrderCard), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
