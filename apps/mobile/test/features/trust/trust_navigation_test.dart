import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_profile/presentation/pages/provider_profile_page.dart';
import 'package:mobile/features/provider_profile/repositories/mock_provider_profile_repository.dart';
import 'package:mobile/features/provider_profile/repositories/provider_profile_repository.dart';
import 'package:mobile/features/trust/presentation/pages/trust_page.dart';
import 'package:mobile/features/trust/repositories/mock_trust_repository.dart';
import 'package:mobile/features/trust/repositories/trust_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Provider Profile open Trust — see the feature README.
///
/// Both `ProviderProfilePage` and `TrustPage` are reached here via
/// internal navigation/direct construction without an explicit
/// repository override, so both resolve from the service locator —
/// hence registering mocks for each here.
void main() {
  setUp(() {
    locator.registerSingleton<ProviderProfileRepository>(
      MockProviderProfileRepository(),
    );
    locator.registerSingleton<TrustRepository>(MockTrustRepository());
  });
  tearDown(() => locator.reset());

  testWidgets('tapping "Confianza" in Provider Profile opens Trust', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(body: ProviderProfilePage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Confianza'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Confianza'));
    await tester.pumpAndSettle();

    expect(find.byType(TrustPage), findsOneWidget);
    expect(find.text('Confianza y reputación'), findsWidgets);
  });
}
