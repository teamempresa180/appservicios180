import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/session/provider_availability_controller.dart';
import 'package:mobile/core/session/provider_availability_storage.dart';
import 'package:mobile/core/session/user_role.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/home/presentation/widgets/availability_toggle.dart';
import 'package:mobile/features/home/presentation/widgets/home_header.dart';

void main() {
  setUp(
    () => locator.registerSingleton<ProviderAvailabilityController>(
      ProviderAvailabilityController(storage: ProviderAvailabilityStorage()),
    ),
  );
  tearDown(() => locator.reset());

  Widget buildApp(Widget child) {
    return MaterialApp(theme: AppTheme.light, home: Scaffold(body: child));
  }

  testWidgets('HomeHeader shows the toggle only for the provider role', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(const HomeHeader(role: UserRole.provider)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AvailabilityToggle), findsOneWidget);
  });

  testWidgets('HomeHeader hides the toggle for the client role', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(const HomeHeader(role: UserRole.client)));
    await tester.pumpAndSettle();

    expect(find.byType(AvailabilityToggle), findsNothing);
  });

  testWidgets('defaults to Disponible and switches to Ocupado on tap', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(const AvailabilityToggle()));
    await tester.pumpAndSettle();

    expect(locator<ProviderAvailabilityController>().isAvailable, isTrue);

    await tester.tap(find.text('Ocupado'));
    await tester.pumpAndSettle();

    expect(locator<ProviderAvailabilityController>().isAvailable, isFalse);

    await tester.tap(find.text('Disponible'));
    await tester.pumpAndSettle();

    expect(locator<ProviderAvailabilityController>().isAvailable, isTrue);
  });
}
