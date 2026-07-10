import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/provider_dashboard/presentation/pages/provider_dashboard_page.dart';
import 'package:mobile/features/provider_dashboard/presentation/widgets/dashboard_statistics.dart';
import 'package:mobile/features/provider_dashboard/presentation/widgets/earnings_summary.dart';
import 'package:mobile/features/provider_dashboard/presentation/widgets/pending_requests.dart';
import 'package:mobile/features/provider_dashboard/presentation/widgets/provider_performance.dart';
import 'package:mobile/features/provider_dashboard/presentation/widgets/recent_orders.dart';

void main() {
  Widget buildApp({
    ProviderDashboardViewState state = ProviderDashboardViewState.information,
  }) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: ProviderDashboardPage(state: state)),
    );
  }

  testWidgets('shows the header with the provider name', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Panel del proveedor'), findsWidgets);
    expect(find.text('Diana Restrepo'), findsOneWidget);
  });

  testWidgets('shows the simulated earnings summary', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(EarningsSummary), findsOneWidget);
    expect(find.text('\$45'), findsOneWidget);
    expect(find.text('\$310'), findsOneWidget);
    expect(find.text('\$1280'), findsOneWidget);
  });

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

  testWidgets('shows performance with simulated and derived values', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderPerformance), findsOneWidget);
    expect(find.text('Responde en menos de 1 hora'), findsOneWidget);
    expect(find.text('92%'), findsOneWidget);
  });

  testWidgets('shows recent orders and the pending request', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(RecentOrders), findsOneWidget);
    expect(find.byType(PendingRequests), findsOneWidget);
    expect(find.text('Instalación de tomacorrientes'), findsWidgets);
  });

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
      buildApp(state: ProviderDashboardViewState.loading),
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

  testWidgets('empty state shows AppEmptyState instead of the information', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(state: ProviderDashboardViewState.empty));
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(EarningsSummary), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
