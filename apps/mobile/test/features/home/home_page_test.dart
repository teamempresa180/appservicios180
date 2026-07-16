import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/home/presentation/pages/home_page.dart';

void main() {
  Widget buildApp() {
    return MaterialApp(
      theme: AppTheme.light,
      home: const Scaffold(body: HomePage()),
    );
  }

  testWidgets('shows the greeting and the Cliente content (mock role)', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Hola, María'), findsOneWidget);
    expect(find.text('¿Qué servicio necesitas hoy?'), findsOneWidget);
    expect(find.text('Categorías rápidas'), findsOneWidget);
    expect(find.text('Plomería'), findsOneWidget);
    expect(find.text('Electricidad'), findsOneWidget);
    expect(find.text('Limpieza'), findsOneWidget);
    expect(find.text('Jardinería'), findsOneWidget);
    expect(find.text('Pintura'), findsOneWidget);

    // Proveedor-only content must not be present.
    expect(find.text('Resumen rápido'), findsNothing);
  });

  testWidgets('does not build its own Scaffold (lives inside the Shell)', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    // Only the Scaffold provided by the test harness itself exists.
    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
