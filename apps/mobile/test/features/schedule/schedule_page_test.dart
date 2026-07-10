import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/schedule/presentation/pages/schedule_page.dart';
import 'package:mobile/features/schedule/presentation/widgets/schedule_block_card.dart';
import 'package:mobile/features/schedule/presentation/widgets/schedule_statistics.dart';

void main() {
  Widget buildApp({ScheduleViewState state = ScheduleViewState.information}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: SchedulePage(state: state)),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Agenda'), findsWidgets);
  });

  testWidgets('shows statistics derived from the real schedule blocks', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ScheduleStatistics), findsOneWidget);
    // 3 open, 1 completed, 1 blocked, 1 cancelled.
    expect(find.text('3'), findsOneWidget);
    expect(find.text('1'), findsNWidgets(3));
    expect(find.text('Horas abiertas: 10h'), findsOneWidget);
  });

  testWidgets('shows all six schedule blocks', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ScheduleBlockCard), findsNWidgets(6));
    expect(find.text('Lunes'), findsNWidgets(2));
    expect(find.text('Miércoles'), findsOneWidget);
    expect(find.text('Jueves'), findsOneWidget);
    expect(find.text('Viernes'), findsOneWidget);
    expect(find.text('Sábado'), findsOneWidget);
  });

  testWidgets('shows each block status label', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Abierto'), findsNWidgets(3));
    expect(find.text('Completado'), findsOneWidget);
    expect(find.text('Bloqueado'), findsWidgets);
    expect(find.text('Cancelado'), findsOneWidget);
  });

  testWidgets('loading state shows AppLoading instead of the schedule', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(state: ScheduleViewState.loading));
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(ScheduleBlockCard), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the schedule', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(state: ScheduleViewState.empty));
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(ScheduleBlockCard), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
