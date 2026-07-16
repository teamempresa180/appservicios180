import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/trust/presentation/pages/trust_page.dart';
import 'package:mobile/features/trust/presentation/widgets/trust_factor_card.dart';
import 'package:mobile/features/trust/presentation/widgets/trust_score_card.dart';
import 'package:mobile/features/trust/repositories/mock_trust_repository.dart';
import 'package:mobile/features/trust/repositories/trust_repository.dart';
import 'package:mobile/identity/entities/identity.dart';
import 'package:mobile/trust/entities/trust.dart';

/// Wraps [MockTrustRepository] (already `Future`-returning) so tests
/// can force it to never resolve (loading state) or throw (error
/// state), without touching the real mock data.
class _FakeTrustRepository implements TrustRepository {
  _FakeTrustRepository({this.neverResolves = false, this.throwsError = false});

  final bool neverResolves;
  final bool throwsError;
  final _delegate = MockTrustRepository();

  @override
  Future<Identity> getIdentity() {
    if (neverResolves) return Completer<Identity>().future;
    if (throwsError) {
      return Future.error(const NetworkHttpException('sin conexión'));
    }
    return _delegate.getIdentity();
  }

  @override
  Future<Trust> getTrust() => _delegate.getTrust();
}

void main() {
  Widget buildApp({TrustRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: TrustPage(repository: repository ?? _FakeTrustRepository())),
    );
  }

  testWidgets('shows the header with the display name', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Confianza y reputación'), findsWidgets);
    expect(find.text('Julián Cárdenas'), findsOneWidget);
  });

  testWidgets('shows the real trust score, level and status', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(TrustScoreCard), findsOneWidget);
    expect(find.text('87.5'), findsOneWidget);
    expect(find.text('Nivel Alto'), findsOneWidget);
    expect(find.text('Estado: Activo'), findsOneWidget);
  });

  testWidgets('shows the simulated factors', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(TrustFactorCard), findsNWidgets(4));
    expect(
      find.text('Historial de servicios completados a tiempo'),
      findsOneWidget,
    );
    expect(find.text('Verificación de identidad aprobada'), findsOneWidget);
  });

  testWidgets('loading state shows AppLoading instead of the information', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeTrustRepository(neverResolves: true)),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(TrustScoreCard), findsNothing);
  });

  testWidgets('error state shows a retry action', (tester) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeTrustRepository(throwsError: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.text('Reintentar'), findsOneWidget);
    expect(find.byType(TrustScoreCard), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
