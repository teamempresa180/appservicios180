import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/verification/presentation/pages/verification_page.dart';
import 'package:mobile/features/verification/presentation/widgets/document_preview.dart';
import 'package:mobile/features/verification/presentation/widgets/selfie_preview.dart';
import 'package:mobile/features/verification/presentation/widgets/verification_status.dart';
import 'package:mobile/features/verification/presentation/widgets/verification_step_card.dart';
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
    expect(find.text('Diana Restrepo'), findsOneWidget);
  });

  testWidgets('shows the document preview with the real document type', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(DocumentPreview), findsOneWidget);
    expect(find.text('Cédula de ciudadanía'), findsOneWidget);
  });

  testWidgets('shows the selfie preview', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(SelfiePreview), findsOneWidget);
  });

  testWidgets('shows the simulated verification status and review time', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(VerificationStatusCard), findsOneWidget);
    expect(find.text('En revisión'), findsOneWidget);
    expect(
      find.textContaining('Aproximadamente 24 a 48 horas hábiles'),
      findsOneWidget,
    );
  });

  testWidgets('shows completed and pending steps', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(VerificationStepCard), findsNWidgets(3));
    expect(find.text('Documento de identidad subido'), findsOneWidget);
    expect(find.text('Selfie capturada'), findsWidgets);
    expect(
      find.text('Revisión manual del equipo de confianza'),
      findsOneWidget,
    );
  });

  testWidgets('shows the three verification actions and the submit button', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Tomar foto'), findsOneWidget);
    expect(find.text('Subir documento'), findsOneWidget);
    expect(find.text('Reintentar'), findsOneWidget);
    expect(find.text('Enviar verificación'), findsOneWidget);
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
