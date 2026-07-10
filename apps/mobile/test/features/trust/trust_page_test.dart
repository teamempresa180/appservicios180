import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/trust/presentation/pages/trust_page.dart';
import 'package:mobile/features/trust/presentation/widgets/trust_factor_card.dart';
import 'package:mobile/features/trust/presentation/widgets/trust_score_card.dart';

void main() {
  Widget buildApp({TrustViewState state = TrustViewState.information}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: TrustPage(state: state)),
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
    await tester.pumpWidget(buildApp(state: TrustViewState.loading));
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(TrustScoreCard), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the information', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(state: TrustViewState.empty));
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(TrustScoreCard), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
