import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/notifications/presentation/pages/notifications_page.dart';
import 'package:mobile/features/notifications/presentation/widgets/notification_card.dart';
import 'package:mobile/features/notifications/presentation/widgets/notification_filter_tabs.dart';

void main() {
  Widget buildApp({
    NotificationsViewState state = NotificationsViewState.list,
  }) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: NotificationsPage(state: state)),
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
    expect(find.widgetWithText(ChoiceChip, 'Todas'), findsOneWidget);
    expect(find.widgetWithText(ChoiceChip, 'No leídas'), findsOneWidget);
    expect(find.widgetWithText(ChoiceChip, 'Pedidos'), findsOneWidget);
    expect(find.widgetWithText(ChoiceChip, 'Pagos'), findsOneWidget);
    expect(find.widgetWithText(ChoiceChip, 'Mensajes'), findsOneWidget);
  });

  testWidgets('selecting a tab only changes its visual selection', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    final chipBefore = tester.widget<ChoiceChip>(
      find.widgetWithText(ChoiceChip, 'No leídas'),
    );
    expect(chipBefore.selected, isFalse);

    await tester.tap(find.text('No leídas'));
    await tester.pumpAndSettle();

    final chipAfter = tester.widget<ChoiceChip>(
      find.widgetWithText(ChoiceChip, 'No leídas'),
    );
    expect(chipAfter.selected, isTrue);
    // The list is unaffected — still shows every mock notification.
    expect(find.byType(NotificationCard), findsNWidgets(5));
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
    await tester.pumpWidget(buildApp(state: NotificationsViewState.loading));
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
    await tester.pumpWidget(buildApp(state: NotificationsViewState.empty));
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
