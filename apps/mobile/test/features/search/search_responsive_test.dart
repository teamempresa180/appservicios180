import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/search/presentation/pages/search_page.dart';
import 'package:mobile/features/search/repositories/mock_search_repository.dart';
import 'package:mobile/features/search/repositories/search_repository.dart';
import 'package:mobile/service/entities/service.dart';

class _FakeSearchRepository implements SearchRepository {
  _FakeSearchRepository(this._result);

  final Future<List<Service>> Function() _result;

  @override
  Future<List<Service>> getAll() => _result();
}

void main() {
  const widths = [320.0, 360.0, 390.0, 412.0, 768.0, 1024.0, 1440.0];

  Future<void> setSurfaceSize(WidgetTester tester, double width) async {
    final size = Size(width, 900);
    await tester.binding.setSurfaceSize(size);
    tester.view.physicalSize = size;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });
  }

  for (final width in widths) {
    testWidgets('Search (results) has no overflow at ${width}px', (
      tester,
    ) async {
      await setSurfaceSize(tester, width);
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(body: SearchPage(repository: MockSearchRepository())),
        ),
      );
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
    });

    testWidgets('Search (empty) has no overflow at ${width}px', (
      tester,
    ) async {
      await setSurfaceSize(tester, width);
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: SearchPage(
              repository: _FakeSearchRepository(() async => const []),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
    });

    testWidgets('Search (loading) has no overflow at ${width}px', (
      tester,
    ) async {
      await setSurfaceSize(tester, width);
      final completer = Completer<List<Service>>();
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: SearchPage(
              repository: _FakeSearchRepository(() => completer.future),
            ),
          ),
        ),
      );
      // Indeterminate CircularProgressIndicator never settles.
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(tester.takeException(), isNull);
      completer.complete(const []);
      await tester.pumpAndSettle();
    });
  }
}
