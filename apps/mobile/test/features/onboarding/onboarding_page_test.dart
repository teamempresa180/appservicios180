import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:mobile/core/navigation/routes/app_routes.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/onboarding/presentation/pages/onboarding_page.dart';

void main() {
  Widget buildApp() {
    final router = GoRouter(
      initialLocation: AppRoutes.onboarding,
      routes: [
        GoRoute(
          path: AppRoutes.onboarding,
          builder: (context, state) => const OnboardingPage(),
        ),
        GoRoute(
          path: AppRoutes.login,
          builder: (context, state) =>
              const Scaffold(body: Text('Login placeholder')),
        ),
      ],
    );

    return MaterialApp.router(theme: AppTheme.light, routerConfig: router);
  }

  testWidgets('shows the first slide with a "Siguiente" button', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Bienvenido'), findsOneWidget);
    expect(find.text('Siguiente'), findsOneWidget);
    expect(find.text('Comenzar'), findsNothing);
  });

  testWidgets('swiping moves through the slides and updates the indicator', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.drag(find.byType(PageView), const Offset(-600, 0));
    await tester.pumpAndSettle();

    expect(find.text('Contrata con confianza'), findsOneWidget);

    await tester.drag(find.byType(PageView), const Offset(-600, 0));
    await tester.pumpAndSettle();

    expect(find.text('Todo desde una sola aplicación'), findsOneWidget);
    expect(find.text('Comenzar'), findsOneWidget);
  });

  testWidgets('pressing "Comenzar" on the last slide navigates to Login', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.drag(find.byType(PageView), const Offset(-600, 0));
    await tester.pumpAndSettle();
    await tester.drag(find.byType(PageView), const Offset(-600, 0));
    await tester.pumpAndSettle();

    await tester.tap(find.widgetWithText(FilledButton, 'Comenzar'));
    await tester.pumpAndSettle();

    expect(find.text('Login placeholder'), findsOneWidget);
  });
}
