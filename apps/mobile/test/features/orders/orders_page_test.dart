import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_chip.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/orders/presentation/pages/orders_page.dart';
import 'package:mobile/features/orders/presentation/widgets/order_card.dart';
import 'package:mobile/features/orders/presentation/widgets/order_status_tabs.dart';

void main() {
  Widget buildApp({OrdersViewState state = OrdersViewState.list}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: OrdersPage(state: state)),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Mis órdenes'), findsOneWidget);
  });

  testWidgets('shows the four status tabs', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(OrderStatusTabs), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'Pendientes'), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'En progreso'), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'Finalizadas'), findsOneWidget);
    expect(find.widgetWithText(AppChip, 'Canceladas'), findsOneWidget);
  });

  testWidgets('selecting a tab only changes its visual selection', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    final chipBefore = tester.widget<AppChip>(
      find.widgetWithText(AppChip, 'Finalizadas'),
    );
    expect(chipBefore.selected, isFalse);

    await tester.tap(find.text('Finalizadas'));
    await tester.pumpAndSettle();

    final chipAfter = tester.widget<AppChip>(
      find.widgetWithText(AppChip, 'Finalizadas'),
    );
    expect(chipAfter.selected, isTrue);
    // The list is unaffected — still shows every mock order.
    expect(find.byType(OrderCard), findsNWidgets(4));
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

  testWidgets('shows the status-dependent main action per order', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Ver cotización'), findsOneWidget);
    expect(find.text('Ver detalle'), findsOneWidget);
    expect(find.text('Calificar'), findsOneWidget);
    expect(find.text('Ver información'), findsOneWidget);
  });

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(state: OrdersViewState.loading));
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
    await tester.pumpWidget(buildApp(state: OrdersViewState.empty));
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
