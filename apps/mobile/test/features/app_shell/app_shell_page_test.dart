import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/app_shell/presentation/pages/app_shell_page.dart';
import 'package:mobile/features/app_shell/presentation/widgets/app_bottom_navigation.dart';
import 'package:mobile/features/app_shell/presentation/widgets/app_navigation_rail.dart';
import 'package:mobile/features/app_shell/presentation/widgets/shell_placeholder.dart';
import 'package:mobile/features/home/presentation/pages/home_page.dart';
import 'package:mobile/features/marketplace/presentation/pages/marketplace_page.dart';
import 'package:mobile/features/profile/presentation/pages/profile_page.dart';

void main() {
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

    expect(find.text('AppServicios'), findsOneWidget);
    expect(find.byIcon(Icons.notifications_outlined), findsOneWidget);
    expect(find.byType(HomePage), findsOneWidget);
    expect(find.text('¿Qué servicio necesitas hoy?'), findsOneWidget);
  });

  testWidgets('uses BottomNavigationBar on narrow (mobile) widths', (
    tester,
  ) async {
    await setSurfaceSize(tester, const Size(400, 800));
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AppBottomNavigation), findsOneWidget);
    expect(find.byType(AppNavigationRail), findsNothing);

    final labelsFinder = find.descendant(
      of: find.byType(AppBottomNavigation),
      matching: find.text('Inicio'),
    );
    expect(labelsFinder, findsOneWidget);
    expect(
      find.descendant(
        of: find.byType(AppBottomNavigation),
        matching: find.text('Buscar'),
      ),
      findsOneWidget,
    );
    expect(
      find.descendant(
        of: find.byType(AppBottomNavigation),
        matching: find.text('Órdenes'),
      ),
      findsOneWidget,
    );
    expect(
      find.descendant(
        of: find.byType(AppBottomNavigation),
        matching: find.text('Mensajes'),
      ),
      findsOneWidget,
    );
    expect(
      find.descendant(
        of: find.byType(AppBottomNavigation),
        matching: find.text('Perfil'),
      ),
      findsOneWidget,
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
        matching: find.text('Perfil'),
      ),
    );
    await tester.pumpAndSettle();

    final updatedBottomNav = tester.widget<NavigationBar>(
      find.descendant(
        of: find.byType(AppBottomNavigation),
        matching: find.byType(NavigationBar),
      ),
    );
    expect(updatedBottomNav.selectedIndex, 4);
    expect(find.byType(ProfilePage, skipOffstage: false), findsOneWidget);
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
      expect(stack.children, hasLength(5));
      expect(stack.index, 0);

      // All five destinations are already built (IndexedStack keeps every
      // child in the tree, it only paints the selected one): Home
      // (Inicio), Marketplace (Buscar), Profile (Perfil) plus two
      // placeholders (Órdenes, Mensajes). The default finder skips
      // "offstage" widgets, so the non-selected ones must be looked up
      // with skipOffstage: false to prove they exist.
      expect(find.byType(HomePage, skipOffstage: false), findsOneWidget);
      expect(
        find.byType(MarketplacePage, skipOffstage: false),
        findsOneWidget,
      );
      expect(find.byType(ProfilePage, skipOffstage: false), findsOneWidget);
      expect(
        find.byType(ShellPlaceholder, skipOffstage: false),
        findsNWidgets(2),
      );

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

      // Still all five destinations built after switching tabs — none
      // were disposed/recreated.
      expect(find.byType(HomePage, skipOffstage: false), findsOneWidget);
      expect(
        find.byType(MarketplacePage, skipOffstage: false),
        findsOneWidget,
      );
      expect(find.byType(ProfilePage, skipOffstage: false), findsOneWidget);
      expect(
        find.byType(ShellPlaceholder, skipOffstage: false),
        findsNWidgets(2),
      );
    },
  );
}
