import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_profile/presentation/pages/provider_profile_page.dart';
import 'package:mobile/features/provider_profile/repositories/mock_provider_profile_repository.dart';
import 'package:mobile/features/provider_profile/repositories/provider_profile_repository.dart';
import 'package:mobile/features/verification/presentation/pages/verification_page.dart';
import 'package:mobile/features/verification/repositories/mock_verification_repository.dart';
import 'package:mobile/features/verification/repositories/verification_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Provider Profile open Verification — see the feature README.
///
/// Both `ProviderProfilePage` and `VerificationPage` are reached here
/// via internal navigation/direct construction without an explicit
/// repository override, so both resolve from the service locator —
/// hence registering mocks for each here.
void main() {
  setUp(() {
    locator.registerSingleton<ProviderProfileRepository>(
      MockProviderProfileRepository(),
    );
    locator.registerSingleton<VerificationRepository>(
      MockVerificationRepository(),
    );
  });
  tearDown(() => locator.reset());

  testWidgets('tapping "Verificación" in Provider Profile opens Verification', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(body: ProviderProfilePage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Verificación'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Verificación'));
    await tester.pumpAndSettle();

    expect(find.byType(VerificationPage), findsOneWidget);
    expect(find.text('Verificación de identidad'), findsWidgets);
  });
}
