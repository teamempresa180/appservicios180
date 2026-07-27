import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/session/user_role_controller.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_curves.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../chat/presentation/pages/chat_list_page.dart';
import '../../../home/presentation/pages/home_page.dart';
import '../../../marketplace/presentation/pages/marketplace_page.dart';
import '../../../orders/presentation/pages/orders_page.dart';
import '../../../orders/presentation/pages/provider_requests_page.dart';
import '../../navigation_intent.dart';
import '../models/shell_navigation_item.dart';
import '../widgets/app_bottom_navigation.dart';
import '../widgets/app_drawer.dart';
import '../widgets/app_navigation_rail.dart';
import '../widgets/app_top_bar.dart';

/// Reusable App Shell: top bar + an [IndexedStack] body + a navigation
/// surface that automatically switches between [AppBottomNavigation]
/// (mobile) and [AppNavigationRail] (tablet/desktop, width >=
/// [wideBreakpoint]).
///
/// The 5 destinations depend on [UserRoleController]'s current role
/// (switched from the App Shell's drawer): Cliente gets Inicio/Buscar/
/// Órdenes/Mensajes/Menú; Prestador gets Inicio/Servicios/Historial/
/// Mensajes/Menú instead — a provider doesn't browse/request services,
/// they manage the ones they offer (accept/reject) and their job
/// history. "Menú" (last destination, [ShellNavigationItem.opensDrawer])
/// opens the App Shell's drawer instead of switching tabs — Perfil and
/// Notificaciones live there now, keeping the bottom navigation at
/// exactly 5 compact destinations. Switching role resets
/// [_selectedIndex] to 0, since the two tab sets don't line up
/// index-for-index. Navigation between destinations is purely local
/// ([_selectedIndex] via `setState`) — see the feature README for the
/// GoRouter integration plan.
class AppShellPage extends StatefulWidget {
  const AppShellPage({super.key});

  /// Below this width, use [AppBottomNavigation]; at or above it, use
  /// [AppNavigationRail].
  static const double wideBreakpoint = 900;

  /// Caps how wide the body content stretches on desktop/wide windows
  /// (e.g. a maximized Windows window). Purely a desktop reading-comfort
  /// measure — the breakpoint/layout switch above is unchanged, this
  /// only centers the already-wide layout's content instead of letting
  /// cards/text stretch edge-to-edge at very large widths.
  static const double maxContentWidth = 1200;

  static const List<ShellNavigationItem> _clientNavigationItems = [
    ShellNavigationItem(
      icon: Icons.home_outlined,
      selectedIcon: Icons.home,
      label: 'Inicio',
      index: 0,
    ),
    ShellNavigationItem(
      icon: Icons.search_outlined,
      selectedIcon: AppIcons.search,
      label: 'Buscar',
      index: 1,
    ),
    ShellNavigationItem(
      icon: Icons.receipt_long_outlined,
      selectedIcon: Icons.receipt_long,
      label: 'Órdenes',
      index: 2,
    ),
    ShellNavigationItem(
      icon: Icons.chat_bubble_outline,
      selectedIcon: Icons.chat_bubble,
      label: 'Mensajes',
      index: 3,
    ),
    ShellNavigationItem(
      icon: Icons.menu_outlined,
      selectedIcon: Icons.menu,
      label: 'Menú',
      index: 4,
      opensDrawer: true,
    ),
  ];

  static const List<ShellNavigationItem> _providerNavigationItems = [
    ShellNavigationItem(
      icon: Icons.home_outlined,
      selectedIcon: Icons.home,
      label: 'Inicio',
      index: 0,
    ),
    ShellNavigationItem(
      icon: Icons.design_services_outlined,
      selectedIcon: Icons.design_services,
      label: 'Servicios',
      index: 1,
    ),
    ShellNavigationItem(
      icon: Icons.history_outlined,
      selectedIcon: Icons.history,
      label: 'Historial',
      index: 2,
    ),
    ShellNavigationItem(
      icon: Icons.chat_bubble_outline,
      selectedIcon: Icons.chat_bubble,
      label: 'Mensajes',
      index: 3,
    ),
    ShellNavigationItem(
      icon: Icons.menu_outlined,
      selectedIcon: Icons.menu,
      label: 'Menú',
      index: 4,
      opensDrawer: true,
    ),
  ];

  @override
  State<AppShellPage> createState() => _AppShellPageState();
}

class _AppShellPageState extends State<AppShellPage> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    locator<AppShellNavigationIntent>().addListener(_onNavigationIntent);
    locator<UserRoleController>().addListener(_onRoleChanged);
  }

  @override
  void dispose() {
    locator<AppShellNavigationIntent>().removeListener(_onNavigationIntent);
    locator<UserRoleController>().removeListener(_onRoleChanged);
    super.dispose();
  }

  void _onRoleChanged() {
    // The two tab sets don't share a common index layout (e.g. index 1
    // is "Buscar" for Cliente but "Servicios" for Prestador) — staying
    // on the same index across a role switch would land on the wrong
    // destination, so always land back on "Inicio".
    setState(() => _selectedIndex = 0);
  }

  void _onNavigationIntent() {
    final tabIndex = locator<AppShellNavigationIntent>().pendingTabIndex;
    if (tabIndex == null) return;
    locator<AppShellNavigationIntent>().consumeTabIndex();
    setState(() => _selectedIndex = tabIndex);
  }

  void _onDestinationSelected(int index, List<ShellNavigationItem> items) {
    if (items[index].opensDrawer) {
      _scaffoldKey.currentState?.openDrawer();
      return;
    }
    setState(() => _selectedIndex = index);
  }

  Widget _buildBody(bool isProvider) {
    final children = isProvider
        ? const [
            HomePage(),
            ProviderRequestsPage(),
            OrdersPage(),
            ChatListPage(),
          ]
        : const [
            HomePage(),
            MarketplacePage(),
            OrdersPage(),
            ChatListPage(),
          ];
    return _TabFade(
      index: _selectedIndex,
      child: IndexedStack(index: _selectedIndex, children: children),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isWide =
        MediaQuery.sizeOf(context).width >= AppShellPage.wideBreakpoint;
    final isProvider = locator<UserRoleController>().isProvider;
    final navigationItems = isProvider
        ? AppShellPage._providerNavigationItems
        : AppShellPage._clientNavigationItems;

    final body = _buildBody(isProvider);

    if (isWide) {
      return Scaffold(
        key: _scaffoldKey,
        appBar: const AppTopBar(),
        drawer: const AppDrawer(),
        body: Row(
          children: [
            AppNavigationRail(
              items: navigationItems,
              currentIndex: _selectedIndex,
              onTap: (index) =>
                  _onDestinationSelected(index, navigationItems),
            ),
            const VerticalDivider(width: 1),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.space16),
                child: Align(
                  alignment: Alignment.topCenter,
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(
                      maxWidth: AppShellPage.maxContentWidth,
                    ),
                    child: body,
                  ),
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Scaffold(
      key: _scaffoldKey,
      appBar: const AppTopBar(),
      drawer: const AppDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(AppSpacing.space16),
        child: body,
      ),
      bottomNavigationBar: AppBottomNavigation(
        items: navigationItems,
        currentIndex: _selectedIndex,
        onTap: (index) => _onDestinationSelected(index, navigationItems),
      ),
    );
  }
}

/// Fades [child] in whenever [index] changes, without unmounting it —
/// unlike wrapping the `IndexedStack` in a plain `FadeIn` (which only
/// plays once, on the Shell's very first build), this retriggers on
/// every destination switch, so moving between destinations reads as a
/// soft cross-fade instead of an instant cut. Deliberately keeps
/// `IndexedStack` itself as the direct child of `build()` (not
/// recreated), so every destination's scroll position/state stays
/// preserved exactly as before.
class _TabFade extends StatefulWidget {
  const _TabFade({required this.index, required this.child});

  final int index;
  final Widget child;

  @override
  State<_TabFade> createState() => _TabFadeState();
}

class _TabFadeState extends State<_TabFade>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: AppDurations.medium,
    )..forward();
    _opacity = CurvedAnimation(parent: _controller, curve: AppCurves.standard);
  }

  @override
  void didUpdateWidget(covariant _TabFade oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.index != widget.index) {
      _controller.forward(from: 0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(opacity: _opacity, child: widget.child);
  }
}
