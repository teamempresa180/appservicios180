import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/orders/repositories/mock_orders_repository.dart';
import 'package:mobile/features/chat/repositories/mock_chat_repository.dart';
import 'package:mobile/features/provider_dashboard/presentation/pages/provider_dashboard_page.dart';
import 'package:mobile/features/provider_dashboard/presentation/widgets/active_service_card.dart';
import 'package:mobile/features/provider_dashboard/presentation/widgets/dashboard_statistics.dart';
import 'package:mobile/features/provider_dashboard/presentation/widgets/earnings_summary.dart';
import 'package:mobile/features/provider_dashboard/presentation/widgets/pending_quotes.dart';
import 'package:mobile/features/provider_dashboard/presentation/widgets/pending_requests.dart';
import 'package:mobile/features/provider_dashboard/presentation/widgets/provider_performance.dart';
import 'package:mobile/features/provider_dashboard/presentation/widgets/recent_orders.dart';
import 'package:mobile/features/provider_dashboard/repositories/mock_provider_dashboard_repository.dart';
import 'package:mobile/features/provider_dashboard/repositories/provider_dashboard_repository.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/payment/entities/payment.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/quote/entities/quote.dart';
import 'package:mobile/review/entities/review.dart';

/// Wraps [MockProviderDashboardRepository] (already `Future`-returning)
/// so tests can force it to never resolve (loading state), return an
/// empty dashboard (all six calls empty), or throw (error state),
/// without touching the real mock data.
class _FakeProviderDashboardRepository implements ProviderDashboardRepository {
  _FakeProviderDashboardRepository({
    this.neverResolves = false,
    this.forceError = false,
  });

  final bool neverResolves;
  final bool forceError;
  final _delegate = MockProviderDashboardRepository();

  @override
  Future<Provider> getProvider() {
    if (neverResolves) return Completer<Provider>().future;
    if (forceError) throw const NetworkHttpException('sin conexión');
    return _delegate.getProvider();
  }

  @override
  Future<Profile> getProfile() {
    if (neverResolves) return Completer<Profile>().future;
    if (forceError) throw const NetworkHttpException('sin conexión');
    return _delegate.getProfile();
  }

  @override
  Future<List<Order>> getOrders() {
    if (neverResolves) return Completer<List<Order>>().future;
    if (forceError) throw const NetworkHttpException('sin conexión');
    return _delegate.getOrders();
  }

  @override
  Future<List<Quote>> getQuotes() {
    if (neverResolves) return Completer<List<Quote>>().future;
    if (forceError) throw const NetworkHttpException('sin conexión');
    return _delegate.getQuotes();
  }

  @override
  Future<List<Review>> getReviews() {
    if (neverResolves) return Completer<List<Review>>().future;
    if (forceError) throw const NetworkHttpException('sin conexión');
    return _delegate.getReviews();
  }

  @override
  Future<List<Payment>> getPayments() {
    if (neverResolves) return Completer<List<Payment>>().future;
    if (forceError) throw const NetworkHttpException('sin conexión');
    return _delegate.getPayments();
  }
}

void main() {
  Widget buildApp({ProviderDashboardRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: ProviderDashboardPage(
          repository: repository ?? _FakeProviderDashboardRepository(),
          ordersRepository: MockOrdersRepository(),
          chatRepository: MockChatRepository(),
        ),
      ),
    );
  }

  testWidgets('shows the header with the provider name', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Panel del proveedor'), findsWidgets);
    expect(find.text('Diana Restrepo'), findsOneWidget);
  });

  testWidgets(
    'shows a zeroed earnings summary with an explanation when no '
    'completed payment falls in the current day/week/month',
    (tester) async {
      // The mock payments are pinned to a fixed 2026-01-01 seed date
      // (see mock_provider_dashboard_data.dart) so today/week/month
      // earnings are genuinely $0 whenever the suite runs after that
      // month — exactly the "no earnings yet" case the explanatory
      // text exists for.
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      expect(find.byType(EarningsSummary), findsOneWidget);
      expect(find.text('\$0'), findsNWidgets(3));
      expect(
        find.textContaining('en cuanto se registre tu primer pago'),
        findsOneWidget,
      );
    },
  );

  testWidgets('shows statistics derived from the real orders and reviews', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(DashboardStatistics), findsOneWidget);
    // 1 accepted/inProgress, 2 completed, 1 pending, avg rating (5+4+5)/3=4.7
    // "2" (completed count) also appears in ProviderPerformance's
    // "Servicios completados" row, so it isn't unique on the page.
    expect(find.text('1'), findsWidgets);
    expect(find.text('2'), findsWidgets);
    expect(find.text('4.7'), findsOneWidget);
  });

  testWidgets(
    'shows performance derived from real quotes and orders, with no '
    'fabricated response-time figure',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      expect(find.byType(ProviderPerformance), findsOneWidget);
      // 1 accepted / 1 decided quote (the other is still pending) = 100%.
      expect(find.text('100%'), findsOneWidget);
      expect(find.textContaining('Responde en menos de'), findsNothing);
    },
  );

  testWidgets(
    'shows the active in-progress order front and center, the already-'
    'quoted pending order as a waiting quote, and a compact history link',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      // The one InProgress order ("Reparación de fuga de agua")
      // outranks everything else and becomes the prominent active card.
      expect(find.byType(ActiveServiceCard), findsOneWidget);
      expect(find.text('Reparación de fuga de agua'), findsOneWidget);

      // The one Pending order already has a quote from this provider
      // (see mock_provider_dashboard_data.dart), so it shows up as a
      // waiting quote, not a new request to act on.
      expect(find.byType(PendingQuotes), findsOneWidget);
      expect(find.text('Instalación de tomacorrientes'), findsOneWidget);
      expect(find.byType(PendingRequests), findsOneWidget);
      expect(
        find.text('No tienes solicitudes nuevas por cotizar.'),
        findsOneWidget,
      );

      // History is a low-key link, not an inline list of past orders.
      expect(find.byType(RecentOrders), findsOneWidget);
      expect(find.text('Ver historial'), findsOneWidget);
    },
  );

  testWidgets('shows the four quick actions', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Ver servicios'), findsOneWidget);
    expect(find.text('Disponibilidad'), findsOneWidget);
    // "Estadísticas" also appears as the DashboardStatistics section
    // title, so it isn't unique on the page.
    expect(find.text('Estadísticas'), findsWidgets);
    expect(find.text('Configuración'), findsOneWidget);
  });

  testWidgets('loading state shows AppLoading instead of the information', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(
        repository: _FakeProviderDashboardRepository(neverResolves: true),
      ),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(EarningsSummary), findsNothing);
  });

  testWidgets('error state shows AppEmptyState with a retry action', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeProviderDashboardRepository(forceError: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.text('No se pudo cargar el panel'), findsOneWidget);
    expect(find.text('Reintentar'), findsOneWidget);
    expect(find.byType(EarningsSummary), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
