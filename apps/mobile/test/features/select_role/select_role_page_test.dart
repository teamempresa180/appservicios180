import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/navigation/routes/app_routes.dart';
import 'package:mobile/core/session/user_role.dart';
import 'package:mobile/core/session/user_role_controller.dart';
import 'package:mobile/core/session/user_role_storage.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/select_role/presentation/pages/select_role_page.dart';

/// In-memory stand-in — the real [UserRoleStorage] wraps
/// `flutter_secure_storage`, a real platform channel with no mock
/// handler registered in this test binary. Widget tests must not
/// depend on that channel resolving in any particular time (or at
/// all): `setRole` awaits `_storage.save(...)` before `SelectRolePage`
/// navigates, so a hung/slow real write would make navigation never
/// happen within `pumpAndSettle`'s window.
class _InMemoryUserRoleStorage implements UserRoleStorage {
  UserRole _stored = UserRole.client;

  @override
  Future<UserRole> read() async => _stored;

  @override
  Future<void> save(UserRole role) async => _stored = role;
}

void main() {
  setUp(() {
    locator.registerSingleton<UserRoleController>(
      UserRoleController(storage: _InMemoryUserRoleStorage()),
    );
  });
  tearDown(() => locator.reset());

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

    expect(find.text('¿Cómo deseas usar SERVICIOS 180°?'), findsOneWidget);
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
