import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/verification/presentation/pages/verification_page.dart';
import 'package:mobile/features/verification/presentation/widgets/document_preview.dart';
import 'package:mobile/features/verification/presentation/widgets/verification_actions.dart';
import 'package:mobile/features/verification/repositories/mock_verification_repository.dart';
import 'package:mobile/features/verification/repositories/verification_repository.dart';
import 'package:mobile/identity/entities/identity.dart';
import 'package:mobile/profiles/entities/profile.dart';

/// Wraps [MockVerificationRepository] (already `Future`-returning) so
/// tests can force it to never resolve (loading state) or throw
/// (error state), without touching the real mock data.
class _FakeVerificationRepository implements VerificationRepository {
  _FakeVerificationRepository({
    this.neverResolves = false,
    this.throwsError = false,
  });

  final bool neverResolves;
  final bool throwsError;
  final _delegate = MockVerificationRepository();

  @override
  Future<Identity> getIdentity() {
    if (neverResolves) return Completer<Identity>().future;
    if (throwsError) {
      return Future.error(const NetworkHttpException('sin conexión'));
    }
    return _delegate.getIdentity();
  }

  @override
  Future<Profile> getProfile() => _delegate.getProfile();
}

void main() {
  Widget buildApp({VerificationRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: VerificationPage(repository: repository ?? _FakeVerificationRepository()),
      ),
    );
  }

  testWidgets('shows the header with the display name', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Verificación de identidad'), findsWidgets);
    expect(find.text('Diana Restrepo'), findsWidgets);
  });

  testWidgets('shows the real identity on file, with a masked number', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(DocumentPreview), findsOneWidget);
    expect(find.text('Cédula de ciudadanía'), findsOneWidget);
    // Real `Identity.documentNumber` is '1094825671' — only the last
    // four digits are printed.
    expect(find.text('••••••5671'), findsOneWidget);
    expect(find.text('1094825671'), findsNothing);
  });

  testWidgets('states no fabricated verification status or steps', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    // Nothing behind these ever existed — the screen used to claim the
    // app held documents it had never received.
    expect(find.text('En revisión'), findsNothing);
    expect(
      find.textContaining('Aproximadamente 24 a 48 horas hábiles'),
      findsNothing,
    );
    expect(find.text('Documento de identidad subido'), findsNothing);
    expect(find.text('Selfie capturada'), findsNothing);
  });

  testWidgets('replaces the dead action buttons with one honest notice', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(VerificationActions), findsOneWidget);
    expect(find.textContaining('estará disponible próximamente'), findsOneWidget);
    for (final label in [
      'Tomar foto',
      'Subir documento',
      'Reintentar',
      'Enviar verificación',
    ]) {
      expect(find.text(label), findsNothing);
    }
  });

  testWidgets('loading state shows AppLoading instead of the information', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeVerificationRepository(neverResolves: true)),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(DocumentPreview), findsNothing);
  });

  testWidgets('error state shows a retry action', (tester) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeVerificationRepository(throwsError: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(DocumentPreview), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
