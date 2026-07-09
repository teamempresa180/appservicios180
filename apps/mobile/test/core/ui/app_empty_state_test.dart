import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';

void main() {
  Widget buildApp(Widget child) {
    return MaterialApp(theme: AppTheme.light, home: Scaffold(body: child));
  }

  testWidgets('shows icon, title and description without an action', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(
        const AppEmptyState(
          title: 'Sin resultados',
          description: 'Intenta con otra búsqueda.',
          icon: Icons.search_off,
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byIcon(Icons.search_off), findsOneWidget);
    expect(find.text('Sin resultados'), findsOneWidget);
    expect(find.text('Intenta con otra búsqueda.'), findsOneWidget);
    expect(find.byType(FilledButton), findsNothing);
  });

  testWidgets('renders the action as an AppButton when provided', (
    tester,
  ) async {
    var tapped = false;
    await tester.pumpWidget(
      buildApp(
        AppEmptyState(
          title: 'Sin resultados',
          actionLabel: 'Reintentar',
          onActionPressed: () => tapped = true,
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Reintentar'), findsOneWidget);
    await tester.tap(find.text('Reintentar'));
    expect(tapped, isTrue);
  });
}
