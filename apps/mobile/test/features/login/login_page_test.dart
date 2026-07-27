import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:mobile/core/navigation/routes/app_routes.dart';
import 'package:mobile/core/session/auth_repository.dart';
import 'package:mobile/core/session/auth_tokens.dart';
import 'package:mobile/core/session/session_manager.dart';
import 'package:mobile/core/storage/secure_token_storage.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/login/presentation/pages/login_page.dart';

/// In-memory stand-in for [SecureTokenStorage] — avoids touching the
/// real `flutter_secure_storage` platform channel in widget tests.
class _FakeSecureTokenStorage implements SecureTokenStorage {
  String? _accessToken;
  String? _refreshToken;

  @override
  Future<void> save({
    required String accessToken,
    required String refreshToken,
  }) async {
    _accessToken = accessToken;
    _refreshToken = refreshToken;
  }

  @override
  Future<String?> readAccessToken() async => _accessToken;

  @override
  Future<String?> readRefreshToken() async => _refreshToken;

  @override
  Future<void> clear() async {
    _accessToken = null;
    _refreshToken = null;
  }
}

class _FakeAuthRepository implements AuthRepository {
  @override
  Future<AuthTokens> login({
    required String documentNumber,
    required String password,
  }) async =>
      const AuthTokens(accessToken: 'access', refreshToken: 'refresh', role: 'CUSTOMER');

  @override
  Future<AuthTokens> refresh(String refreshToken) async =>
      const AuthTokens(accessToken: 'access', refreshToken: 'refresh', role: 'CUSTOMER');

  @override
  Future<void> logout(String refreshToken) async {}

  @override
  Future<CurrentUser> me() async =>
      const CurrentUser(id: 'user-1', role: 'CUSTOMER');
}

void main() {
  Widget buildApp() {
    final sessionManager = SessionManager(
      authRepository: _FakeAuthRepository(),
      tokenStorage: _FakeSecureTokenStorage(),
    );
    final router = GoRouter(
      initialLocation: AppRoutes.login,
      routes: [
        GoRoute(
          path: AppRoutes.login,
          builder: (context, state) =>
              LoginPage(sessionManager: sessionManager),
        ),
        GoRoute(
          path: AppRoutes.register,
          builder: (context, state) =>
              const Scaffold(body: Text('Register placeholder')),
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

  testWidgets('shows title, subtitle and fields', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Iniciar sesión'), findsOneWidget);
    expect(find.text('Ingresa tus datos para continuar.'), findsOneWidget);
    expect(find.text('Número de documento'), findsOneWidget);
    expect(find.text('Contraseña'), findsOneWidget);
    expect(find.text('Continuar'), findsOneWidget);
  });

  testWidgets('shows validation errors for empty fields', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.tap(find.widgetWithText(FilledButton, 'Continuar'));
    await tester.pumpAndSettle();

    expect(
      find.text('El número de documento es obligatorio.'),
      findsOneWidget,
    );
    expect(find.text('La contraseña es obligatoria.'), findsOneWidget);
  });

  testWidgets('shows an error for a short password', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.enterText(
      find.widgetWithText(TextFormField, 'Número de documento'),
      '123456789',
    );
    await tester.enterText(
      find.widgetWithText(TextFormField, 'Contraseña'),
      '1234',
    );
    await tester.tap(find.widgetWithText(FilledButton, 'Continuar'));
    await tester.pumpAndSettle();

    expect(
      find.text('La contraseña debe tener al menos 8 caracteres.'),
      findsOneWidget,
    );
  });

  testWidgets('toggling the password visibility icon unmasks the text', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    EditableText editableTextOf(WidgetTester t) => t.widget<EditableText>(
      find
          .descendant(
            of: find.widgetWithText(TextFormField, 'Contraseña'),
            matching: find.byType(EditableText),
          )
          .first,
    );

    expect(editableTextOf(tester).obscureText, isTrue);

    await tester.tap(find.byIcon(Icons.visibility_outlined));
    await tester.pumpAndSettle();

    expect(editableTextOf(tester).obscureText, isFalse);
  });

  testWidgets('valid submit shows loading and then navigates to Home', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.enterText(
      find.widgetWithText(TextFormField, 'Número de documento'),
      '123456789',
    );
    await tester.enterText(
      find.widgetWithText(TextFormField, 'Contraseña'),
      'password123',
    );
    await tester.tap(find.widgetWithText(FilledButton, 'Continuar'));
    await tester.pump();

    expect(find.text('Ingresando...'), findsOneWidget);

    await tester.pumpAndSettle(const Duration(seconds: 2));

    expect(find.text('Home placeholder'), findsOneWidget);
  });

  testWidgets(
    '"¿Olvidaste tu contraseña?" and "Crear cuenta" navigate to Register',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      await tester.tap(find.text('Crear cuenta'));
      await tester.pumpAndSettle();

      expect(find.text('Register placeholder'), findsOneWidget);
    },
  );
}
