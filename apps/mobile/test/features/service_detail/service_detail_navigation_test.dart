import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/app_shell/navigation_intent.dart';
import 'package:mobile/features/marketplace/presentation/pages/marketplace_page.dart';
import 'package:mobile/features/marketplace/repositories/category_repository.dart'
    as marketplace;
import 'package:mobile/features/marketplace/repositories/mock_category_repository.dart'
    as marketplace;
import 'package:mobile/features/marketplace/repositories/mock_provider_repository.dart';
import 'package:mobile/features/marketplace/repositories/mock_service_repository.dart';
import 'package:mobile/features/marketplace/repositories/provider_repository.dart';
import 'package:mobile/features/marketplace/repositories/service_repository.dart';
import 'package:mobile/features/request_service/presentation/pages/request_service_page.dart';
import 'package:mobile/features/request_service/repositories/mock_request_service_repository.dart';
import 'package:mobile/features/request_service/repositories/request_service_repository.dart';
import 'package:mobile/features/search/presentation/pages/search_page.dart';
import 'package:mobile/features/search/repositories/mock_search_repository.dart';
import 'package:mobile/features/search/repositories/search_repository.dart';
import 'package:mobile/features/service_detail/presentation/pages/service_detail_page.dart';
import 'package:mobile/features/service_detail/repositories/mock_service_detail_repository.dart';
import 'package:mobile/features/service_detail/repositories/service_detail_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Marketplace and Search open Service Detail — see the feature README.
///
/// `ServiceDetailPage` is reached here via internal navigation (not
/// constructed directly by the test), so it always resolves its
/// repository from the service locator — hence registering a mock here.
/// `MarketplacePage` is also constructed with no explicit repository
/// overrides, so its three repositories are registered too.
void main() {
  setUp(() {
    locator.registerSingleton<ServiceDetailRepository>(
      MockServiceDetailRepository(),
    );
    locator.registerSingleton<marketplace.CategoryRepository>(
      marketplace.MockCategoryRepository(),
    );
    locator.registerSingleton<ServiceRepository>(MockServiceRepository());
    locator.registerSingleton<ProviderRepository>(MockProviderRepository());
    locator.registerSingleton<SearchRepository>(MockSearchRepository());
    locator.registerSingleton<RequestServiceRepository>(
      MockRequestServiceRepository(),
    );
    locator.registerSingleton<AppShellNavigationIntent>(
      AppShellNavigationIntent(),
    );
  });
  tearDown(() => locator.reset());

  testWidgets('tapping a Marketplace ServiceCard opens Service Detail', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(body: MarketplacePage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Reparación de fuga de agua').first);
    await tester.pumpAndSettle();

    expect(find.byType(ServiceDetailPage), findsOneWidget);
    expect(find.text('Detalle del servicio'), findsOneWidget);
  });

  testWidgets('tapping "Ver" on a Search result opens Service Detail', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(body: SearchPage(repository: MockSearchRepository())),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Ver').first);
    await tester.pumpAndSettle();

    expect(find.byType(ServiceDetailPage), findsOneWidget);
    expect(find.text('Detalle del servicio'), findsOneWidget);
  });

  testWidgets(
    'tapping "Solicitar servicio" on Service Detail opens Request Service',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(body: ServiceDetailPage()),
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Solicitar servicio'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Solicitar servicio'));
      await tester.pumpAndSettle();

      expect(find.byType(RequestServicePage), findsOneWidget);
      expect(find.text('Solicitar servicio'), findsWidgets);
    },
  );
}
