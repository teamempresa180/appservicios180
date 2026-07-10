import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/provider_services/presentation/pages/provider_services_page.dart';
import 'package:mobile/features/provider_services/presentation/widgets/service_card.dart';
import 'package:mobile/features/provider_services/presentation/widgets/services_statistics.dart';

void main() {
  Widget buildApp({
    ProviderServicesViewState state = ProviderServicesViewState.information,
  }) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: ProviderServicesPage(state: state)),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Mis servicios'), findsOneWidget);
  });

  testWidgets('shows statistics derived from the real services', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ServicesStatistics), findsOneWidget);
    // 2 active, 1 paused (inactive), 1 archived.
    expect(find.text('2'), findsWidgets);
    expect(find.text('1'), findsWidgets);
  });

  testWidgets('shows the add-service button', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Nuevo servicio'), findsOneWidget);
  });

  testWidgets('shows every mock service with its category and price', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ServiceCard), findsNWidgets(4));
    expect(find.text('Reparación de fuga de agua'), findsOneWidget);
    expect(find.text('Plomería'), findsWidgets);
    expect(find.text('\$45'), findsOneWidget);
  });

  testWidgets('shows the status-derived badge per service', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Activo'), findsNWidgets(2));
    expect(find.text('Pausado'), findsOneWidget);
    expect(find.text('Archivado'), findsOneWidget);
  });

  testWidgets('shows edit/pause/delete actions for every service', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Editar'), findsNWidgets(4));
    expect(find.text('Pausar'), findsNWidgets(4));
    expect(find.text('Eliminar'), findsNWidgets(4));
  });

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(state: ProviderServicesViewState.loading),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(ServiceCard), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(state: ProviderServicesViewState.empty),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(ServiceCard), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
