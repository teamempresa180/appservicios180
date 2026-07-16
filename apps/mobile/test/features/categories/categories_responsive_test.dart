import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/entities/category.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/categories/mock/mock_categories_data.dart';
import 'package:mobile/features/categories/presentation/pages/categories_page.dart';
import 'package:mobile/features/categories/repositories/category_repository.dart';

class _FakeCategoryRepository implements CategoryRepository {
  _FakeCategoryRepository(this._result);

  final Future<List<Category>> Function() _result;

  @override
  Future<List<Category>> getAll() => _result();
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
    testWidgets('Categories (normal state) has no overflow at ${width}px', (
      tester,
    ) async {
      await setSurfaceSize(tester, width);
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: CategoriesPage(
              repository: _FakeCategoryRepository(
                () async => List.unmodifiable(mockCategories),
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
    });

    testWidgets('Categories (empty state) has no overflow at ${width}px', (
      tester,
    ) async {
      await setSurfaceSize(tester, width);
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: CategoriesPage(
              repository: _FakeCategoryRepository(() async => const []),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
    });

    testWidgets('Categories (loading state) has no overflow at ${width}px', (
      tester,
    ) async {
      // The loading state renders an indeterminate `CircularProgressIndicator`
      // (via `AppLoading`), which animates forever — `pumpAndSettle` would
      // time out waiting for it to stop. A couple of fixed `pump`s are
      // enough to lay out the frame and surface any overflow.
      await setSurfaceSize(tester, width);
      final completer = Completer<List<Category>>();
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: CategoriesPage(
              repository: _FakeCategoryRepository(() => completer.future),
            ),
          ),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(tester.takeException(), isNull);
      completer.complete(const []);
      await tester.pumpAndSettle();
    });
  }
}
