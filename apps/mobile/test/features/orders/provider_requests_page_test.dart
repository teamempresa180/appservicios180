import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/entities/category.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/orders/presentation/pages/provider_requests_page.dart';
import 'package:mobile/features/orders/presentation/widgets/provider_request_card.dart';
import 'package:mobile/features/orders/repositories/mock_orders_repository.dart';
import 'package:mobile/features/orders/repositories/orders_repository.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/order/models/order_status.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/quote/entities/quote.dart';
import 'package:mobile/service/entities/service.dart';

/// Wraps [MockOrdersRepository] so tests can force it to never resolve
/// (loading state) or return no pending orders (empty state), and can
/// swap in an accept/reject implementation that fails — same forwarding
/// pattern as `orders_page_test.dart`'s `_FakeOrdersRepository`.
class _FakeOrdersRepository implements OrdersRepository {
  _FakeOrdersRepository({this.neverResolves = false, this.forceEmpty = false});

  final bool neverResolves;
  final bool forceEmpty;
  final _delegate = MockOrdersRepository();

  @override
  Future<List<Order>> getOrders() {
    if (neverResolves) return Completer<List<Order>>().future;
    if (forceEmpty) return Future.value(const []);
    return _delegate.getOrders();
  }

  @override
  Future<Service> getServiceFor(Order order) => _delegate.getServiceFor(order);

  @override
  Future<Provider> getProviderFor(Order order) =>
      _delegate.getProviderFor(order);

  @override
  Future<Profile> getProfileFor(Order order) => _delegate.getProfileFor(order);

  @override
  Future<Category> getCategoryFor(Order order) =>
      _delegate.getCategoryFor(order);

  @override
  Future<Quote> getQuoteFor(Order order) => _delegate.getQuoteFor(order);

  @override
  Future<Profile> getClientProfileFor(Order order) =>
      _delegate.getClientProfileFor(order);

  @override
  Future<Order> acceptOrder(Order order) => _delegate.acceptOrder(order);

  @override
  Future<Order> rejectOrder(Order order) => _delegate.rejectOrder(order);
}

void main() {
  Widget buildApp({OrdersRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: ProviderRequestsPage(repository: repository ?? _FakeOrdersRepository()),
      ),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Servicios'), findsOneWidget);
  });

  testWidgets(
    'lists only the pending order (mockOrders has exactly one)',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      expect(find.byType(ProviderRequestCard), findsOneWidget);
      expect(find.text('Laura Gómez'), findsOneWidget);
    },
  );

  testWidgets('does not show an "add service" affordance', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.textContaining('Nuevo servicio'), findsNothing);
  });

  testWidgets('tapping "Aceptar" removes the request from the list', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderRequestCard), findsOneWidget);

    await tester.tap(find.text('Aceptar'));
    await tester.pumpAndSettle();

    expect(find.byType(ProviderRequestCard), findsNothing);
    expect(find.textContaining('Aceptaste la solicitud'), findsOneWidget);
  });

  testWidgets('tapping "Rechazar" removes the request from the list', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('Rechazar'));
    await tester.pumpAndSettle();

    expect(find.byType(ProviderRequestCard), findsNothing);
    expect(find.textContaining('Rechazaste la solicitud'), findsOneWidget);
  });

  testWidgets(
    'the mock repository actually flips the order status to accepted',
    (tester) async {
      final repository = MockOrdersRepository();
      await tester.pumpWidget(buildApp(repository: repository));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Aceptar'));
      await tester.pumpAndSettle();

      final orders = await repository.getOrders();
      final pending = orders.where((o) => o.status == OrderStatus.pending);
      expect(pending, isEmpty);
      final accepted = orders.where((o) => o.status == OrderStatus.accepted);
      expect(accepted, hasLength(1));
    },
  );

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeOrdersRepository(neverResolves: true)),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(ProviderRequestCard), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState when there are no requests', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeOrdersRepository(forceEmpty: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(ProviderRequestCard), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
  });
}
