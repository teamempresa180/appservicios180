import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/session/mock_auth_repository.dart';
import 'package:mobile/core/session/provider_availability_controller.dart';
import 'package:mobile/core/session/provider_availability_storage.dart';
import 'package:mobile/core/session/session_manager.dart';
import 'package:mobile/core/session/user_role.dart';
import 'package:mobile/core/session/user_role_controller.dart';
import 'package:mobile/core/session/user_role_storage.dart';
import 'package:mobile/core/storage/secure_token_storage.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/app_shell/navigation_intent.dart';
import 'package:mobile/features/app_shell/presentation/pages/app_shell_page.dart';
import 'package:mobile/features/app_shell/presentation/widgets/app_bottom_navigation.dart';
import 'package:mobile/features/app_shell/presentation/widgets/app_drawer.dart';
import 'package:mobile/features/app_shell/presentation/widgets/app_navigation_rail.dart';
import 'package:mobile/features/chat/presentation/pages/chat_list_page.dart';
import 'package:mobile/features/chat/repositories/chat_repository.dart';
import 'package:mobile/features/chat/repositories/mock_chat_repository.dart';
import 'package:mobile/features/home/presentation/pages/home_page.dart';
import 'package:mobile/features/marketplace/presentation/pages/marketplace_page.dart';
import 'package:mobile/features/marketplace/repositories/category_repository.dart'
    as marketplace;
import 'package:mobile/features/marketplace/repositories/mock_category_repository.dart'
    as marketplace;
import 'package:mobile/features/marketplace/repositories/mock_provider_repository.dart';
import 'package:mobile/features/marketplace/repositories/mock_service_repository.dart';
import 'package:mobile/features/marketplace/repositories/provider_repository.dart';
import 'package:mobile/features/marketplace/repositories/service_repository.dart';
import 'package:mobile/features/orders/presentation/pages/orders_page.dart';
import 'package:mobile/features/orders/repositories/mock_orders_repository.dart';
import 'package:mobile/features/orders/repositories/orders_repository.dart';
import 'package:mobile/features/profile/presentation/pages/profile_page.dart';
import 'package:mobile/features/profile/repositories/mock_profile_repository.dart';
import 'package:mobile/features/profile/repositories/profile_repository.dart';
import 'package:mobile/features/orders/presentation/pages/provider_requests_page.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';
import 'package:mobile/features/quote/repositories/quote_repository.dart';
import 'package:mobile/features/reviews/repositories/mock_reviews_repository.dart';
import 'package:mobile/features/reviews/repositories/reviews_repository.dart';
import 'package:mobile/features/search/repositories/mock_search_repository.dart';
import 'package:mobile/features/search/repositories/search_repository.dart';

class _FakeSecureTokenStorage implements SecureTokenStorage {
  @override
  Future<void> save({
    required String accessToken,
    required String refreshToken,
  }) async {}

  @override
  Future<String?> readAccessToken() async => null;

  @override
  Future<String?> readRefreshToken() async => null;

  @override
  Future<void> clear() async {}
}

/// `ProfilePage` (reached from the drawer's "Perfil" tile, not
/// constructed directly) always resolves its repository from the
/// service locator — hence registering a mock here. Every destination
/// still in the `IndexedStack` is built eagerly (not lazily on
/// navigation) with no explicit repository overrides either, so every
/// repository the Cliente/Prestador tab sets need needs registering
/// too.
void main() {
  setUp(() {
    locator.registerSingleton<ProfileRepository>(MockProfileRepository());
    locator.registerSingleton<marketplace.CategoryRepository>(
      marketplace.MockCategoryRepository(),
    );
    locator.registerSingleton<ServiceRepository>(MockServiceRepository());
    locator.registerSingleton<ProviderRepository>(MockProviderRepository());
    locator.registerSingleton<SearchRepository>(MockSearchRepository());
    locator.registerSingleton<OrdersRepository>(MockOrdersRepository());
    locator.registerSingleton<QuoteRepository>(MockQuoteRepository());
    locator.registerSingleton<ReviewsRepository>(MockReviewsRepository());
    locator.registerSingleton<ChatRepository>(MockChatRepository());
    locator.registerSingleton<AppShellNavigationIntent>(
      AppShellNavigationIntent(),
    );
    locator.registerSingleton<UserRoleController>(
      UserRoleController(storage: UserRoleStorage()),
    );
    locator.registerSingleton<ProviderAvailabilityController>(
      ProviderAvailabilityController(storage: ProviderAvailabilityStorage()),
    );
    locator.registerSingleton<SessionManager>(
      SessionManager(
        authRepository: MockAuthRepository(),
        tokenStorage: _FakeSecureTokenStorage(),
      ),
    );
  });
  tearDown(() => locator.reset());

  Widget buildApp() {
    return MaterialApp(theme: AppTheme.light, home: const AppShellPage());
  }

  Future<void> setSurfaceSize(WidgetTester tester, Size size) async {
    await tester.binding.setSurfaceSize(size);
    tester.view.physicalSize = size;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });
  }

  testWidgets('shows the top bar title and the Home content for Inicio', (
    tester,
  ) async {
    await setSurfaceSize(tester, const Size(400, 800));
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(
      find.image(const AssetImage('assets/icon/app_icon_source.png')),
      findsOneWidget,
    );
    expect(find.byType(HomePage), findsOneWidget);
    expect(find.text('¿Qué servicio necesitas hoy?'), findsOneWidget);
    // Cliente role: shows "Modo Cliente", not "Modo Proveedor".
    expect(find.text('Modo Cliente'), findsOneWidget);
    expect(find.text('Modo Proveedor'), findsNothing);
  });

  testWidgets('uses BottomNavigationBar on narrow (mobile) widths', (
    tester,
  ) async {
    await setSurfaceSize(tester, const Size(400, 800));
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AppBottomNavigation), findsOneWidget);
    expect(find.byType(AppNavigationRail), findsNothing);

    for (final label in ['Inicio', 'Buscar', 'Órdenes', 'Mensajes', 'Menú']) {
      expect(
        find.descendant(
          of: find.byType(AppBottomNavigation),
          matching: find.text(label),
        ),
        findsOneWidget,
        reason: '"$label" should be a bottom navigation destination',
      );
    }
    // Compact bottom nav: Perfil no longer has its own tab — it lives in
    // the drawer opened via "Menú".
    expect(
      find.descendant(
        of: find.byType(AppBottomNavigation),
        matching: find.text('Perfil'),
      ),
      findsNothing,
    );
  });

  testWidgets('uses NavigationRail on wide (tablet/desktop) widths', (
    tester,
  ) async {
    await setSurfaceSize(tester, const Size(1000, 800));
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AppNavigationRail), findsOneWidget);
    expect(find.byType(AppBottomNavigation), findsNothing);
  });

  testWidgets('tapping a bottom navigation destination selects it', (
    tester,
  ) async {
    await setSurfaceSize(tester, const Size(400, 800));
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    final bottomNav = tester.widget<NavigationBar>(
      find.descendant(
        of: find.byType(AppBottomNavigation),
        matching: find.byType(NavigationBar),
      ),
    );
    expect(bottomNav.selectedIndex, 0);

    await tester.tap(
      find.descendant(
        of: find.byType(AppBottomNavigation),
        matching: find.text('Mensajes'),
      ),
    );
    await tester.pumpAndSettle();

    final updatedBottomNav = tester.widget<NavigationBar>(
      find.descendant(
        of: find.byType(AppBottomNavigation),
        matching: find.byType(NavigationBar),
      ),
    );
    expect(updatedBottomNav.selectedIndex, 3);
    expect(find.byType(ChatListPage, skipOffstage: false), findsOneWidget);
  });

  testWidgets('tapping "Menú" opens the drawer instead of switching tabs', (
    tester,
  ) async {
    await setSurfaceSize(tester, const Size(400, 800));
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.tap(
      find.descendant(
        of: find.byType(AppBottomNavigation),
        matching: find.text('Menú'),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppDrawer), findsOneWidget);
    expect(find.text('Perfil'), findsOneWidget);
    expect(find.text('Notificaciones'), findsOneWidget);

    // The tab selection underneath the (now open) drawer is untouched —
    // "Menú" is a trigger, not a real destination.
    final bottomNav = tester.widget<NavigationBar>(
      find.descendant(
        of: find.byType(AppBottomNavigation),
        matching: find.byType(NavigationBar),
      ),
    );
    expect(bottomNav.selectedIndex, 0);
  });

  testWidgets('the drawer\'s "Perfil" tile opens ProfilePage', (
    tester,
  ) async {
    await setSurfaceSize(tester, const Size(400, 800));
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.tap(
      find.descendant(
        of: find.byType(AppBottomNavigation),
        matching: find.text('Menú'),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Perfil'));
    await tester.pumpAndSettle();

    expect(find.byType(ProfilePage), findsOneWidget);
  });

  testWidgets('tapping a navigation rail destination selects it', (
    tester,
  ) async {
    await setSurfaceSize(tester, const Size(1000, 800));
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    final rail = tester.widget<NavigationRail>(
      find.descendant(
        of: find.byType(AppNavigationRail),
        matching: find.byType(NavigationRail),
      ),
    );
    expect(rail.selectedIndex, 0);

    await tester.tap(
      find.descendant(
        of: find.byType(AppNavigationRail),
        matching: find.text('Órdenes'),
      ),
    );
    await tester.pumpAndSettle();

    final updatedRail = tester.widget<NavigationRail>(
      find.descendant(
        of: find.byType(AppNavigationRail),
        matching: find.byType(NavigationRail),
      ),
    );
    expect(updatedRail.selectedIndex, 2);
  });

  testWidgets(
    'IndexedStack keeps every destination built, preserving tab state',
    (tester) async {
      await setSurfaceSize(tester, const Size(400, 800));
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      final stack = tester.widget<IndexedStack>(find.byType(IndexedStack));
      expect(stack.children, hasLength(4));
      expect(stack.index, 0);

      // All four real destinations are already built (IndexedStack keeps
      // every child in the tree, it only paints the selected one): Home
      // (Inicio), Marketplace (Buscar), Orders (Órdenes), Chat
      // (Mensajes). "Menú" isn't a stack destination — it opens the
      // drawer instead. The default finder skips "offstage" widgets, so
      // the non-selected ones must be looked up with skipOffstage: false
      // to prove they exist.
      expect(find.byType(HomePage, skipOffstage: false), findsOneWidget);
      expect(find.byType(MarketplacePage, skipOffstage: false), findsOneWidget);
      expect(find.byType(OrdersPage, skipOffstage: false), findsOneWidget);
      expect(find.byType(ChatListPage, skipOffstage: false), findsOneWidget);

      await tester.tap(
        find.descendant(
          of: find.byType(AppBottomNavigation),
          matching: find.text('Mensajes'),
        ),
      );
      await tester.pumpAndSettle();

      final updatedStack = tester.widget<IndexedStack>(
        find.byType(IndexedStack),
      );
      expect(updatedStack.index, 3);

      // Still all four destinations built after switching tabs — none
      // were disposed/recreated.
      expect(find.byType(HomePage, skipOffstage: false), findsOneWidget);
      expect(find.byType(MarketplacePage, skipOffstage: false), findsOneWidget);
      expect(find.byType(OrdersPage, skipOffstage: false), findsOneWidget);
      expect(find.byType(ChatListPage, skipOffstage: false), findsOneWidget);
    },
  );

  testWidgets(
    'Prestador role shows Servicios/Historial instead of Buscar, and the '
    '"Modo Proveedor" badge',
    (tester) async {
      await setSurfaceSize(tester, const Size(400, 800));
      locator<UserRoleController>().setRole(UserRole.provider);
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      expect(find.text('Modo Proveedor'), findsOneWidget);

      expect(
        find.descendant(
          of: find.byType(AppBottomNavigation),
          matching: find.text('Buscar'),
        ),
        findsNothing,
      );
      expect(
        find.descendant(
          of: find.byType(AppBottomNavigation),
          matching: find.text('Servicios'),
        ),
        findsOneWidget,
      );
      expect(
        find.descendant(
          of: find.byType(AppBottomNavigation),
          matching: find.text('Historial'),
        ),
        findsOneWidget,
      );

      final stack = tester.widget<IndexedStack>(find.byType(IndexedStack));
      expect(stack.children, hasLength(4));
      expect(
        find.byType(ProviderRequestsPage, skipOffstage: false),
        findsOneWidget,
      );
      expect(
        find.byType(MarketplacePage, skipOffstage: false),
        findsNothing,
      );
    },
  );

  testWidgets('switching role resets the selected tab back to Inicio', (
    tester,
  ) async {
    await setSurfaceSize(tester, const Size(400, 800));
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.tap(
      find.descendant(
        of: find.byType(AppBottomNavigation),
        matching: find.text('Mensajes'),
      ),
    );
    await tester.pumpAndSettle();
    expect(
      tester
          .widget<NavigationBar>(
            find.descendant(
              of: find.byType(AppBottomNavigation),
              matching: find.byType(NavigationBar),
            ),
          )
          .selectedIndex,
      3,
    );

    locator<UserRoleController>().setRole(UserRole.provider);
    await tester.pumpAndSettle();

    expect(
      tester
          .widget<NavigationBar>(
            find.descendant(
              of: find.byType(AppBottomNavigation),
              matching: find.byType(NavigationBar),
            ),
          )
          .selectedIndex,
      0,
    );
  });
}
