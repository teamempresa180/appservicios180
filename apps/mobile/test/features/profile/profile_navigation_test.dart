import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/app_shell/presentation/pages/app_shell_page.dart';
import 'package:mobile/features/app_shell/presentation/widgets/app_bottom_navigation.dart';
import 'package:mobile/features/profile/presentation/pages/profile_page.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets the
/// App Shell open Profile — see the feature README (and `app_shell`'s
/// README).
void main() {
  testWidgets(
    'tapping "Perfil" in the App Shell bottom navigation shows ProfilePage',
    (tester) async {
      await tester.binding.setSurfaceSize(const Size(400, 800));
      tester.view.physicalSize = const Size(400, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        MaterialApp(theme: AppTheme.light, home: const AppShellPage()),
      );
      await tester.pumpAndSettle();

      await tester.tap(
        find.descendant(
          of: find.byType(AppBottomNavigation),
          matching: find.text('Perfil'),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.byType(ProfilePage), findsOneWidget);
    },
  );
}
