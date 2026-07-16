import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/app_shell/presentation/pages/app_shell_page.dart';
import 'package:mobile/features/app_shell/presentation/widgets/app_bottom_navigation.dart';
import 'package:mobile/features/marketplace/repositories/category_repository.dart'
    as marketplace;
import 'package:mobile/features/marketplace/repositories/mock_category_repository.dart'
    as marketplace;
import 'package:mobile/features/marketplace/repositories/mock_provider_repository.dart';
import 'package:mobile/features/marketplace/repositories/mock_service_repository.dart';
import 'package:mobile/features/marketplace/repositories/provider_repository.dart';
import 'package:mobile/features/marketplace/repositories/service_repository.dart';
import 'package:mobile/features/profile/presentation/pages/profile_page.dart';
import 'package:mobile/features/profile/repositories/mock_profile_repository.dart';
import 'package:mobile/features/profile/repositories/profile_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets the
/// App Shell open Profile — see the feature README (and `app_shell`'s
/// README).
///
/// `ProfilePage` is reached here via internal navigation, not
/// constructed directly, so it always resolves its repository from
/// the service locator — hence registering a mock here.
/// `MarketplacePage` is built eagerly by the `IndexedStack` (not
/// lazily on navigation), but it's constructed with no explicit
/// repository overrides either, so its three repositories need
/// registering too (see `app_shell_page_test.dart`).
void main() {
  setUp(() {
    locator.registerSingleton<ProfileRepository>(MockProfileRepository());
    locator.registerSingleton<marketplace.CategoryRepository>(
      marketplace.MockCategoryRepository(),
    );
    locator.registerSingleton<ServiceRepository>(MockServiceRepository());
    locator.registerSingleton<ProviderRepository>(MockProviderRepository());
  });
  tearDown(() => locator.reset());

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
