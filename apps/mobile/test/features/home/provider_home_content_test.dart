import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/home/presentation/widgets/provider_home_content.dart';

void main() {
  testWidgets('shows the Proveedor summary stats (mock data)', (tester) async {
    // ProviderHomeContent is always hosted inside a SingleChildScrollView
    // by HomePage — match that here so the shrink-wrapped grid inside
    // ProviderSummary gets the unbounded height it expects.
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(
          body: SingleChildScrollView(child: ProviderHomeContent()),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Resumen rápido'), findsOneWidget);
    expect(find.text('Órdenes pendientes'), findsOneWidget);
    expect(find.text('3'), findsOneWidget);
    expect(find.text('Servicios publicados'), findsOneWidget);
    expect(find.text('5'), findsOneWidget);
    expect(find.text('Calificación'), findsOneWidget);
    expect(find.text('4.8'), findsOneWidget);
    expect(find.text('Disponibilidad'), findsOneWidget);
    expect(find.text('Disponible'), findsOneWidget);
  });
}
