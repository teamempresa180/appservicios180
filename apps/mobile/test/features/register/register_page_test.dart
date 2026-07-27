import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:mobile/core/navigation/routes/app_routes.dart';
import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/session/auth_repository.dart';
import 'package:mobile/core/session/auth_tokens.dart';
import 'package:mobile/core/session/session_manager.dart';
import 'package:mobile/core/storage/secure_token_storage.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/register/presentation/pages/register_page.dart';
import 'package:mobile/features/register/repositories/register_repository.dart';
import 'package:mobile/identity/models/document_type.dart';

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

class _FakeRegisterRepository implements RegisterRepository {
  _FakeRegisterRepository({this.throwError = false});

  final bool throwError;
  bool registerCalled = false;

  @override
  Future<void> register({
    required String fullName,
    required DocumentType documentType,
    required String documentNumber,
    required DateTime birthDate,
    required String password,
  }) async {
    if (throwError) {
      throw const BadRequestHttpException('El documento ya está registrado.');
    }
    registerCalled = true;
  }
}

void main() {
  Widget buildApp({RegisterRepository? repository}) {
    final sessionManager = SessionManager(
      authRepository: _FakeAuthRepository(),
      tokenStorage: _FakeSecureTokenStorage(),
    );
    final router = GoRouter(
      initialLocation: AppRoutes.register,
      routes: [
        GoRoute(
          path: AppRoutes.register,
          builder: (context, state) => RegisterPage(
            repository: repository ?? _FakeRegisterRepository(),
            sessionManager: sessionManager,
          ),
        ),
        GoRoute(
          path: AppRoutes.login,
          builder: (context, state) =>
              const Scaffold(body: Text('Login placeholder')),
        ),
        GoRoute(
          path: AppRoutes.selectRole,
          builder: (context, state) =>
              const Scaffold(body: Text('Select role placeholder')),
        ),
      ],
    );

    return MaterialApp.router(theme: AppTheme.light, routerConfig: router);
  }

  Future<void> fillBirthDate(WidgetTester tester) async {
    await tester.ensureVisible(find.text('Fecha de nacimiento'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Fecha de nacimiento'));
    await tester.pumpAndSettle();
    await tester.tap(find.byIcon(Icons.edit_outlined));
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextField).first, '01/01/2000');
    await tester.tap(find.text('OK'));
    await tester.pumpAndSettle();
  }

  Future<void> fillValidForm(WidgetTester tester) async {
    await tester.enterText(
      find.widgetWithText(TextFormField, 'Nombre completo'),
      'Ana Pérez',
    );
    await tester.enterText(
      find.widgetWithText(TextFormField, 'Número de documento'),
      '123456789',
    );
    await fillBirthDate(tester);
    await tester.enterText(
      find.widgetWithText(TextFormField, 'Contraseña'),
      'password123',
    );
    await tester.enterText(
      find.widgetWithText(TextFormField, 'Confirmar contraseña'),
      'password123',
    );
  }

  testWidgets('shows title, subtitle and all fields', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Crear cuenta'), findsOneWidget);
    expect(find.text('Completa la información para comenzar.'), findsOneWidget);
    expect(find.text('Nombre completo'), findsOneWidget);
    expect(find.text('Tipo de documento'), findsOneWidget);
    expect(find.text('Número de documento'), findsOneWidget);
    expect(find.text('Fecha de nacimiento'), findsOneWidget);
    expect(find.text('Contraseña'), findsOneWidget);
    expect(find.text('Confirmar contraseña'), findsOneWidget);
    expect(find.text('Continuar'), findsOneWidget);
  });

  testWidgets('shows validation errors for empty fields', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.widgetWithText(FilledButton, 'Continuar'));
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(FilledButton, 'Continuar'));
    await tester.pumpAndSettle();

    expect(find.text('El nombre completo es obligatorio.'), findsOneWidget);
    expect(
      find.text('El número de documento es obligatorio.'),
      findsOneWidget,
    );
    expect(
      find.text('La fecha de nacimiento es obligatoria.'),
      findsOneWidget,
    );
    expect(find.text('La contraseña es obligatoria.'), findsOneWidget);
    expect(find.text('Confirma tu contraseña.'), findsOneWidget);
  });

  testWidgets('shows an error when passwords do not match', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.enterText(
      find.widgetWithText(TextFormField, 'Nombre completo'),
      'Ana Pérez',
    );
    await tester.enterText(
      find.widgetWithText(TextFormField, 'Número de documento'),
      '123456789',
    );
    await fillBirthDate(tester);
    await tester.enterText(
      find.widgetWithText(TextFormField, 'Contraseña'),
      'password123',
    );
    await tester.enterText(
      find.widgetWithText(TextFormField, 'Confirmar contraseña'),
      'different123',
    );
    await tester.ensureVisible(find.widgetWithText(FilledButton, 'Continuar'));
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(FilledButton, 'Continuar'));
    await tester.pumpAndSettle();

    expect(find.text('Las contraseñas no coinciden.'), findsOneWidget);
  });

  testWidgets(
    'valid submit creates the real account, logs in and navigates to Select Role',
    (tester) async {
      final repository = _FakeRegisterRepository();
      await tester.pumpWidget(buildApp(repository: repository));
      await tester.pumpAndSettle();

      await fillValidForm(tester);
      await tester.ensureVisible(find.widgetWithText(FilledButton, 'Continuar'));
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(FilledButton, 'Continuar'));
      await tester.pump();

      expect(find.text('Creando cuenta...'), findsOneWidget);

      await tester.pumpAndSettle(const Duration(seconds: 2));

      expect(repository.registerCalled, isTrue);
      expect(find.text('Select role placeholder'), findsOneWidget);
    },
  );

  testWidgets('shows the backend error message when registration fails', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeRegisterRepository(throwError: true)),
    );
    await tester.pumpAndSettle();

    await fillValidForm(tester);
    await tester.ensureVisible(find.widgetWithText(FilledButton, 'Continuar'));
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(FilledButton, 'Continuar'));
    await tester.pumpAndSettle();

    expect(find.text('El documento ya está registrado.'), findsOneWidget);
  });

  testWidgets('"Iniciar sesión" navigates to Login', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Iniciar sesión'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Iniciar sesión'));
    await tester.pumpAndSettle();

    expect(find.text('Login placeholder'), findsOneWidget);
  });
}
