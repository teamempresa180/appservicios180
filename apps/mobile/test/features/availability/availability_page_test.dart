import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/availability/entities/availability.dart';
import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/availability/presentation/pages/availability_page.dart';
import 'package:mobile/features/availability/presentation/widgets/availability_statistics.dart';
import 'package:mobile/features/availability/presentation/widgets/day_schedule_card.dart';
import 'package:mobile/features/availability/repositories/availability_repository.dart';
import 'package:mobile/features/availability/repositories/mock_availability_repository.dart';
import 'package:mobile/provider/entities/provider.dart';

/// Wraps [MockAvailabilityRepository] (already `Future`-returning) so
/// tests can force it to never resolve (loading state) or return an
/// empty list (empty state), without touching the real mock data.
class _FakeAvailabilityRepository implements AvailabilityRepository {
  _FakeAvailabilityRepository({
    this.neverResolves = false,
    this.forceEmpty = false,
    this.forceError = false,
  });

  final bool neverResolves;
  final bool forceEmpty;
  final bool forceError;
  final _delegate = MockAvailabilityRepository();

  @override
  Future<Provider> getProvider() {
    if (neverResolves) return Completer<Provider>().future;
    if (forceError) {
      return Future.error(const NetworkHttpException('sin conexión'));
    }
    return _delegate.getProvider();
  }

  @override
  Future<List<Availability>> getAvailabilities() {
    if (neverResolves) return Completer<List<Availability>>().future;
    if (forceEmpty) return Future.value(const []);
    if (forceError) {
      return Future.error(const NetworkHttpException('sin conexión'));
    }
    return _delegate.getAvailabilities();
  }
}

void main() {
  Widget buildApp({AvailabilityRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: AvailabilityPage(
          repository: repository ?? _FakeAvailabilityRepository(),
        ),
      ),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Disponibilidad'), findsOneWidget);
  });

  testWidgets('shows statistics derived from the real availabilities', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AvailabilityStatistics), findsOneWidget);
    // 6 active / 7 days = 86%.
    expect(find.text('86%'), findsOneWidget);
    expect(find.text('6'), findsOneWidget);
    expect(find.text('1'), findsOneWidget);
  });

  testWidgets('shows all seven days Monday through Sunday, in order', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(DayScheduleCard), findsNWidgets(7));

    final dayTexts = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    for (final day in dayTexts) {
      expect(find.text(day), findsOneWidget);
    }
  });

  testWidgets('shows available and unavailable days with their hours', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Disponible'), findsNWidgets(6));
    expect(find.text('No disponible'), findsOneWidget);
    expect(find.text('08:00 - 18:00'), findsNWidgets(5));
    expect(find.text('09:00 - 14:00'), findsOneWidget);
  });

  testWidgets(
    'shows an honest explanation instead of non-functional edit actions',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      expect(
        find.textContaining('tu horario se configura con nuestro equipo'),
        findsOneWidget,
      );
      expect(find.text('Editar horario'), findsNothing);
      expect(find.text('Copiar horario'), findsNothing);
      expect(find.text('Limpiar horario'), findsNothing);
      expect(find.text('Guardar disponibilidad'), findsNothing);
    },
  );

  testWidgets('loading state shows AppLoading instead of the schedule', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(
        repository: _FakeAvailabilityRepository(neverResolves: true),
      ),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(DayScheduleCard), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the schedule', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeAvailabilityRepository(forceEmpty: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(DayScheduleCard), findsNothing);
  });

  testWidgets('error state shows a retry action', (tester) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeAvailabilityRepository(forceError: true)),
    );
    await tester.pumpAndSettle();

    expect(find.text('No se pudo cargar la disponibilidad'), findsOneWidget);
    expect(find.text('Reintentar'), findsOneWidget);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
