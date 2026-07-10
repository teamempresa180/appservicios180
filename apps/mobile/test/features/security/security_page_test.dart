import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/security/presentation/pages/security_page.dart';
import 'package:mobile/features/security/presentation/widgets/auth_method_card.dart';
import 'package:mobile/features/security/presentation/widgets/credential_card.dart';
import 'package:mobile/features/security/presentation/widgets/credentials_section.dart';
import 'package:mobile/features/security/presentation/widgets/security_statistics.dart';

void main() {
  Widget buildApp({SecurityViewState state = SecurityViewState.information}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: SecurityPage(state: state)),
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

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(state: SecurityViewState.loading));
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
    await tester.pumpWidget(buildApp(state: SecurityViewState.empty));
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
