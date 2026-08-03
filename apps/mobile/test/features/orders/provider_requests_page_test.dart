import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/entities/category.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/core/ui/widgets/app_text_field.dart';
import 'package:mobile/features/orders/presentation/pages/provider_requests_page.dart';
import 'package:mobile/features/orders/presentation/widgets/provider_request_card.dart';
import 'package:mobile/features/orders/repositories/mock_orders_repository.dart';
import 'package:mobile/features/orders/repositories/orders_repository.dart';
import 'package:mobile/features/reviews/repositories/mock_reviews_repository.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/quote/entities/quote.dart';
import 'package:mobile/quote/models/quote_type.dart';
import 'package:mobile/service/entities/service.dart';

/// Wraps [MockOrdersRepository] so tests can force `getRelevantOrders`
/// to never resolve (loading state) or return no requests (empty
/// state), same forwarding pattern as `orders_page_test.dart`'s
/// `_FakeOrdersRepository` — every other method just delegates.
class _FakeOrdersRepository implements OrdersRepository {
  _FakeOrdersRepository({this.neverResolves = false, this.forceEmpty = false});

  final bool neverResolves;
  final bool forceEmpty;
  final _delegate = MockOrdersRepository();

  @override
  Future<List<Order>> getRelevantOrders() {
    if (neverResolves) return Completer<List<Order>>().future;
    if (forceEmpty) return Future.value(const []);
    return _delegate.getRelevantOrders();
  }

  @override
  Future<List<Order>> getOrders({CancelToken? cancelToken}) =>
      _delegate.getOrders(cancelToken: cancelToken);

  @override
  Future<Category> getCategoryFor(Order order, {CancelToken? cancelToken}) =>
      _delegate.getCategoryFor(order, cancelToken: cancelToken);

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
        body: ProviderRequestsPage(
          repository: repository ?? MockOrdersRepository(),
          reviewsRepository: MockReviewsRepository(),
        ),
      ),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Servicios'), findsOneWidget);
  });

  testWidgets('shows the Activas/Historial tabs', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Activas'), findsOneWidget);
    expect(find.text('Historial'), findsOneWidget);
  });

  testWidgets(
    'Activas shows every pending/accepted/in-progress relevant order',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      // mockProviderRequestOrders: 3 pending (direct-unquoted,
      // direct-quoted, open) + 1 accepted + 1 in progress = 5 active,
      // 1 completed (history only).
      expect(find.byType(ProviderRequestCard), findsNWidgets(5));
    },
  );

  testWidgets('an order this provider already quoted shows a waiting badge '
      'instead of the action buttons', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Cotización enviada'), findsOneWidget);
    // Two of the three pending cards (direct + open) still need a quote.
    expect(find.text('Enviar cotización'), findsNWidgets(2));
  });

  testWidgets('submitting a quote replaces the action with the waiting badge', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Cotización enviada'), findsOneWidget);

    await tester.tap(find.text('Enviar cotización').first);
    await tester.pumpAndSettle();

    // The bottom sheet form is now open.
    expect(find.byType(AppTextField), findsNWidgets(3));
    await tester.enterText(find.byType(AppTextField).at(0), '50');
    await tester.enterText(find.byType(AppTextField).at(2), 'Puedo ir mañana.');
    await tester.tap(find.text('Enviar cotización').last);
    await tester.pumpAndSettle();

    expect(find.textContaining('Enviaste tu cotización'), findsOneWidget);
    // One more pending request now shows the waiting badge.
    expect(find.text('Cotización enviada'), findsNWidgets(2));
    expect(find.text('Enviar cotización'), findsOneWidget);
  });

  testWidgets('tapping "Rechazar" moves the request out of Activas', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderRequestCard), findsNWidgets(5));

    await tester.tap(find.text('Rechazar').first);
    await tester.pumpAndSettle();

    // Rejecting is irreversible, so it's confirmed first.
    expect(find.text('Rechazar solicitud'), findsOneWidget);
    await tester.tap(find.text('Rechazar').last);
    await tester.pumpAndSettle();

    expect(find.textContaining('Rechazaste la solicitud'), findsOneWidget);
    expect(find.byType(ProviderRequestCard), findsNWidgets(4));
  });

  testWidgets(
    'tapping "Iniciar servicio" then "Marcar como finalizado" advances '
    'the order out of Activas',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      expect(find.text('Iniciar servicio'), findsOneWidget);
      await tester.ensureVisible(find.text('Iniciar servicio'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Iniciar servicio'));
      await tester.pumpAndSettle();

      expect(find.textContaining('Comenzaste el servicio'), findsOneWidget);
      expect(find.text('Marcar como finalizado'), findsNWidgets(2));

      // Let the first action's SnackBar finish its default 4s duration
      // before triggering a second one — `ScaffoldMessenger` queues a
      // new SnackBar behind a still-visible one instead of replacing it.
      await tester.pump(const Duration(seconds: 5));

      await tester.ensureVisible(find.text('Marcar como finalizado').first);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Marcar como finalizado').first);
      await tester.pumpAndSettle();

      // "Marcar como finalizado" now asks for confirmation first.
      final confirmButton = find.text('Finalizar');
      await tester.pumpAndSettle();
      await tester.tap(confirmButton);
      await tester.pumpAndSettle();

      expect(
        find.textContaining('Marcaste como finalizado'),
        findsOneWidget,
      );
      expect(find.byType(ProviderRequestCard), findsNWidgets(4));
    },
  );

  testWidgets('Historial shows only completed/cancelled/rejected orders', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('Historial'));
    await tester.pumpAndSettle();

    expect(find.byType(ProviderRequestCard), findsOneWidget);
    expect(find.text('Finalizada'), findsOneWidget);
  });

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
