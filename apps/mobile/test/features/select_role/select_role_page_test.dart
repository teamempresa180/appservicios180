import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:mobile/core/navigation/routes/app_routes.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/select_role/presentation/pages/select_role_page.dart';

void main() {
  Widget buildApp() {
    final router = GoRouter(
      initialLocation: AppRoutes.selectRole,
      routes: [
        GoRoute(
          path: AppRoutes.selectRole,
          builder: (context, state) => const SelectRolePage(),
        ),
        GoRoute(
          path: AppRoutes.home,
          builder: (context, state) =>
              const Scaffold(body: Text('Home placeholder')),
        ),
      ],
    );

    return MaterialApp.router(theme: AppTheme.light, routerConfig: router);
  }

  testWidgets('shows the title and both role options', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('¿Cómo deseas usar AppServicios?'), findsOneWidget);
    expect(find.text('Cliente'), findsOneWidget);
    expect(find.text('Proveedor'), findsOneWidget);
    expect(find.text('Continuar como Cliente'), findsOneWidget);
    expect(find.text('Continuar como Proveedor'), findsOneWidget);
  });

  testWidgets('choosing Cliente navigates to Home', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('Continuar como Cliente'));
    await tester.pumpAndSettle();

    expect(find.text('Home placeholder'), findsOneWidget);
  });

  testWidgets('choosing Proveedor navigates to Home', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('Continuar como Proveedor'));
    await tester.pumpAndSettle();

    expect(find.text('Home placeholder'), findsOneWidget);
  });
}
