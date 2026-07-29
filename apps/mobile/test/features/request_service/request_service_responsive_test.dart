import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/request_service/mock/mock_request_service_data.dart';
import 'package:mobile/features/request_service/presentation/pages/request_service_page.dart';
import 'package:mobile/features/request_service/repositories/mock_request_service_repository.dart';

void main() {
  const widths = [320.0, 360.0, 390.0, 412.0, 768.0, 1024.0, 1440.0];

  Future<void> setSurfaceSize(WidgetTester tester, double width) async {
    final size = Size(width, 1200);
    await tester.binding.setSurfaceSize(size);
    tester.view.physicalSize = size;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });
  }

  for (final width in widths) {
    testWidgets('Request Service has no overflow at ${width}px', (
      tester,
    ) async {
      await setSurfaceSize(tester, width);
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: RequestServicePage(
              category: mockRequestServiceCategory,
              provider: mockRequestServiceProvider,
              service: mockRequestServiceService,
              profile: mockRequestServiceProfile,
              repository: MockRequestServiceRepository(),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
    });
  }
}
