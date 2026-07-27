import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/app_shell/navigation_intent.dart';
import 'package:mobile/features/marketplace/presentation/pages/marketplace_page.dart';
import 'package:mobile/features/marketplace/repositories/mock_category_repository.dart';
import 'package:mobile/features/marketplace/repositories/mock_provider_repository.dart';
import 'package:mobile/features/marketplace/repositories/mock_service_repository.dart';
import 'package:mobile/features/search/repositories/mock_search_repository.dart';

void main() {
  setUp(
    () => locator.registerSingleton<AppShellNavigationIntent>(
      AppShellNavigationIntent(),
    ),
  );
  tearDown(() => locator.reset());

  const widths = [320.0, 360.0, 390.0, 412.0, 1024.0];

  Future<void> setSurfaceSize(WidgetTester tester, double width) async {
    final size = Size(width, 800);
    await tester.binding.setSurfaceSize(size);
    tester.view.physicalSize = size;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });
  }

  for (final width in widths) {
    testWidgets('Marketplace has no overflow at ${width}px', (tester) async {
      await setSurfaceSize(tester, width);
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: MarketplacePage(
              categoryRepository: MockCategoryRepository(),
              serviceRepository: MockServiceRepository(),
              providerRepository: MockProviderRepository(),
              searchRepository: MockSearchRepository(),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
    });
  }
}
