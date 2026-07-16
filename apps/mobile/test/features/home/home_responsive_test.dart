import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/home/presentation/widgets/client_home_content.dart';
import 'package:mobile/features/home/presentation/widgets/provider_home_content.dart';

void main() {
  Future<void> setSurfaceSize(WidgetTester tester, Size size) async {
    await tester.binding.setSurfaceSize(size);
    tester.view.physicalSize = size;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });
  }

  testWidgets('Cliente content has no overflow at 320px width', (tester) async {
    await setSurfaceSize(tester, const Size(320, 640));
    // Unlike Proveedor content, Cliente content (map + static floating
    // panel) is not meant to scroll — it fills the bounded Scaffold
    // body directly, exactly like it's actually hosted in `HomePage`.
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(body: ClientHomeContent()),
      ),
    );
    await tester.pumpAndSettle();

    expect(tester.takeException(), isNull);
  });

  testWidgets('Proveedor content has no overflow at 320px width', (
    tester,
  ) async {
    await setSurfaceSize(tester, const Size(320, 640));
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(
          body: SingleChildScrollView(child: ProviderHomeContent()),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(tester.takeException(), isNull);
  });
}
