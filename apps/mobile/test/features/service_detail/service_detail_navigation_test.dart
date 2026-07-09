import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/marketplace/presentation/pages/marketplace_page.dart';
import 'package:mobile/features/search/presentation/pages/search_page.dart';
import 'package:mobile/features/service_detail/presentation/pages/service_detail_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Marketplace and Search open Service Detail — see the feature README.
void main() {
  testWidgets('tapping a Marketplace ServiceCard opens Service Detail', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(body: MarketplacePage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Reparación de fuga de agua').first);
    await tester.pumpAndSettle();

    expect(find.byType(ServiceDetailPage), findsOneWidget);
    expect(find.text('Detalle del servicio'), findsOneWidget);
  });

  testWidgets('tapping "Ver" on a Search result opens Service Detail', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(body: SearchPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Ver').first);
    await tester.pumpAndSettle();

    expect(find.byType(ServiceDetailPage), findsOneWidget);
    expect(find.text('Detalle del servicio'), findsOneWidget);
  });
}
