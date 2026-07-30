import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/request_service/mock/mock_request_service_data.dart';
import 'package:mobile/features/quote/presentation/pages/quote_page.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';
import 'package:mobile/features/quote/repositories/quote_repository.dart';
import 'package:mobile/features/request_service/presentation/pages/request_service_page.dart';
import 'package:mobile/features/request_service/repositories/mock_request_service_repository.dart';
import 'package:mobile/features/request_service/repositories/request_service_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Request Service open Quote — see the feature README.
///
/// Both pages are reached here without an explicit `repository`
/// override, so they resolve from the service locator — hence
/// registering mocks here.
void main() {
  setUp(() {
    locator.registerSingleton<QuoteRepository>(MockQuoteRepository());
    locator.registerSingleton<RequestServiceRepository>(
      MockRequestServiceRepository(),
    );
  });
  tearDown(() => locator.reset());

  testWidgets('tapping "Continuar" in Request Service opens Quote', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(
          body: RequestServicePage(category: mockRequestServiceCategory),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // The description field starts empty (no canned prefill — see
    // `RequestServiceViewModel.load`), so a real value is required
    // before "Continuar" allows the submit through.
    await tester.ensureVisible(find.byType(TextFormField));
    await tester.pumpAndSettle();
    await tester.enterText(
      find.widgetWithText(TextFormField, 'Descripción'),
      'Hay una fuga en la cocina.',
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Continuar'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Continuar'));
    await tester.pumpAndSettle();

    expect(find.byType(QuotePage), findsOneWidget);
    expect(find.text('Cotización'), findsWidgets);
  });
}
