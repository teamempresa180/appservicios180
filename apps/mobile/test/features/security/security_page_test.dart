import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/audit/entities/audit.dart';
import 'package:mobile/authentication/entities/authentication.dart';
import 'package:mobile/authentication/models/auth_method_type.dart';
import 'package:mobile/authentication/models/authentication_status.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/credentials/entities/credential.dart';
import 'package:mobile/features/security/presentation/pages/security_page.dart';
import 'package:mobile/features/security/presentation/widgets/audit_log_entry_card.dart';
import 'package:mobile/features/security/presentation/widgets/audit_log_section.dart';
import 'package:mobile/features/security/presentation/widgets/auth_method_card.dart';
import 'package:mobile/features/security/presentation/widgets/credential_card.dart';
import 'package:mobile/features/security/presentation/widgets/credentials_section.dart';
import 'package:mobile/features/security/presentation/widgets/security_statistics.dart';
import 'package:mobile/features/security/repositories/mock_security_repository.dart';
import 'package:mobile/features/security/repositories/security_repository.dart';
import 'package:mobile/identity/entities/identity.dart';

class _FakeSecurityRepository implements SecurityRepository {
  _FakeSecurityRepository({this.neverResolves = false, this.forceEmpty = false});

  final bool neverResolves;
  final bool forceEmpty;
  final _delegate = MockSecurityRepository();

  @override
  Future<Identity> getIdentity() {
    if (neverResolves) return Completer<Identity>().future;
    return _delegate.getIdentity();
  }

  @override
  Future<List<Authentication>> getAuthMethods() =>
      forceEmpty ? Future.value(const []) : _delegate.getAuthMethods();

  @override
  Future<List<Credential>> getCredentials() => _delegate.getCredentials();

  @override
  Future<List<Audit>> getAuditLog() => _delegate.getAuditLog();

  @override
  Future<Authentication> createAuthMethod({
    required Identity identity,
    required AuthMethodType methodType,
  }) => _delegate.createAuthMethod(identity: identity, methodType: methodType);

  @override
  Future<Authentication> updateAuthMethodStatus(
    Authentication authMethod,
    AuthenticationStatus status,
  ) => _delegate.updateAuthMethodStatus(authMethod, status);

  @override
  Future<void> deleteAuthMethod(Authentication authMethod) =>
      _delegate.deleteAuthMethod(authMethod);
}

void main() {
  Widget buildApp({SecurityRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: SecurityPage(repository: repository ?? _FakeSecurityRepository())),
    );
  }

  testWidgets('shows the header with the display name', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Seguridad'), findsWidgets);
    expect(find.text('Camila Torres'), findsOneWidget);
  });

  testWidgets('shows statistics derived from the real auth methods', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(SecurityStatistics), findsOneWidget);
    // 2 active, 1 inactive, 1 locked, 1 revoked.
    expect(find.text('2'), findsOneWidget);
    expect(find.text('1'), findsNWidgets(3));
  });

  testWidgets('shows every mock auth method with its type and status', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AuthMethodCard), findsNWidgets(5));
    expect(
      find.descendant(
        of: find.byType(AuthMethodCard),
        matching: find.text('Contraseña'),
      ),
      findsOneWidget,
    );
    expect(find.text('Biometría'), findsOneWidget);
    expect(find.text('Código de un solo uso'), findsOneWidget);
    expect(find.text('Cuenta de terceros'), findsOneWidget);
    expect(find.text('Otro método'), findsOneWidget);
    expect(find.text('Activo'), findsNWidgets(2));
    expect(find.text('Bloqueado'), findsOneWidget);
    expect(find.text('Inactivo'), findsOneWidget);
    expect(find.text('Revocado'), findsOneWidget);
  });

  testWidgets('shows disable/delete actions for every method', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Desactivar'), findsNWidgets(5));
    expect(find.text('Eliminar'), findsNWidgets(5));
  });

  testWidgets('shows the add-method button', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Agregar método'), findsOneWidget);
  });

  testWidgets(
    'tapping "Agregar método", picking a type adds a real Authentication',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      expect(find.byType(AuthMethodCard), findsNWidgets(5));

      await tester.ensureVisible(find.text('Agregar método'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Agregar método'));
      await tester.pumpAndSettle();

      expect(find.text('Agregar método de autenticación'), findsOneWidget);
      await tester.tap(find.widgetWithText(ListTile, 'Biometría'));
      await tester.pumpAndSettle();

      expect(find.byType(AuthMethodCard), findsNWidgets(6));
      expect(
        find.text('Método de autenticación agregado.'),
        findsOneWidget,
      );
    },
  );

  testWidgets('tapping "Desactivar" toggles the method\'s status', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Activo'), findsNWidgets(2));

    await tester.ensureVisible(find.text('Desactivar').first);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Desactivar').first);
    await tester.pumpAndSettle();

    expect(find.text('Activo'), findsNWidgets(1));
    expect(find.text('Método desactivado.'), findsOneWidget);
  });

  testWidgets('tapping "Eliminar" and confirming removes the method', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AuthMethodCard), findsNWidgets(5));

    await tester.ensureVisible(find.text('Eliminar').first);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Eliminar').first);
    await tester.pumpAndSettle();

    expect(find.text('Eliminar método'), findsOneWidget);
    await tester.tap(find.text('Eliminar').last);
    await tester.pumpAndSettle();

    expect(find.byType(AuthMethodCard), findsNWidgets(4));
    expect(find.text('Método eliminado.'), findsOneWidget);
  });

  testWidgets('shows every mock credential with its type and status', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(CredentialsSection), findsOneWidget);
    expect(find.byType(CredentialCard), findsNWidgets(4));
    expect(
      find.descendant(
        of: find.byType(CredentialCard),
        matching: find.text('Contraseña'),
      ),
      findsOneWidget,
    );
    expect(find.text('Código de recuperación'), findsOneWidget);
    expect(find.text('Llave de seguridad'), findsOneWidget);
    expect(find.text('Otra credencial'), findsOneWidget);
    expect(find.text('Activa'), findsNWidgets(2));
    expect(find.text('Expirada'), findsOneWidget);
    expect(find.text('Revocada'), findsOneWidget);
    expect(find.text('2 activas · 1 expiradas · 1 revocadas'), findsOneWidget);
  });

  testWidgets('shows every mock audit entry, most-recent-first', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AuditLogSection), findsOneWidget);
    expect(find.byType(AuditLogEntryCard), findsNWidgets(5));
    expect(
      find.text('Inicio de sesión desde un nuevo dispositivo (Windows).'),
      findsOneWidget,
    );
    expect(find.text('Contraseña actualizada.'), findsOneWidget);
    expect(
      find.text('Se agregó biometría como método de autenticación.'),
      findsOneWidget,
    );
    expect(
      find.text('Se eliminó una llave de seguridad expirada.'),
      findsOneWidget,
    );
    expect(find.text('Cierre de sesión manual.'), findsOneWidget);

    final firstEntry = tester.widget<AuditLogEntryCard>(
      find.byType(AuditLogEntryCard).first,
    );
    expect(
      firstEntry.entry.description,
      equals('Inicio de sesión desde un nuevo dispositivo (Windows).'),
    );
  });

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeSecurityRepository(neverResolves: true)),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(AuthMethodCard), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeSecurityRepository(forceEmpty: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(AuthMethodCard), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
