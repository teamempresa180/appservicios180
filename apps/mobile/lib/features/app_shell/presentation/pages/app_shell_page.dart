import 'package:flutter/material.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_curves.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../home/presentation/pages/home_page.dart';
import '../../../marketplace/presentation/pages/marketplace_page.dart';
import '../../../profile/presentation/pages/profile_page.dart';
import '../models/shell_navigation_item.dart';
import '../widgets/app_bottom_navigation.dart';
import '../widgets/app_navigation_rail.dart';
import '../widgets/app_top_bar.dart';
import '../widgets/shell_placeholder.dart';

/// Reusable App Shell: top bar + an [IndexedStack] body + a navigation
/// surface that automatically switches between [AppBottomNavigation]
/// (mobile) and [AppNavigationRail] (tablet/desktop, width >=
/// [wideBreakpoint]).
///
/// This is the chrome every future authenticated screen (Home, Search,
/// Orders, Chat, Profile, ...) will be hosted inside of. "Inicio"
/// (`HomePage`), "Buscar" (`MarketplacePage`) and "Perfil"
/// (`ProfilePage`, wired in Prompt 38) have real screens so far — the
/// "Órdenes" and "Mensajes" slots still show a [ShellPlaceholder].
/// Navigation between destinations is purely local ([_selectedIndex] via
/// `setState`) — see the feature README for the GoRouter integration
/// plan.
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

  /// Single source of truth for the navigation surface. Both
  /// [AppBottomNavigation] and [AppNavigationRail] render from this same
  /// list — it is never duplicated.
  static const List<ShellNavigationItem> navigationItems = [
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
      icon: Icons.person_outline,
      selectedIcon: Icons.person,
      label: 'Perfil',
      index: 4,
    ),
  ];

  @override
  State<AppShellPage> createState() => _AppShellPageState();
}

class _AppShellPageState extends State<AppShellPage> {
  int _selectedIndex = 0;

  void _onDestinationSelected(int index) {
    setState(() => _selectedIndex = index);
  }

  Widget _buildBody() {
    return _TabFade(
      index: _selectedIndex,
      child: IndexedStack(
        index: _selectedIndex,
        children: const [
          HomePage(),
          MarketplacePage(),
          ShellPlaceholder(
            icon: Icons.receipt_long_outlined,
            title: 'Órdenes',
            description:
                'Aquí vivirá el listado y seguimiento de las Órdenes de '
                'servicio.',
          ),
          ShellPlaceholder(
            icon: Icons.chat_bubble_outline,
            title: 'Mensajes',
            description: 'Aquí vivirá el Chat entre clientes y proveedores.',
          ),
          ProfilePage(),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isWide =
        MediaQuery.sizeOf(context).width >= AppShellPage.wideBreakpoint;

    final body = _buildBody();

    if (isWide) {
      return Scaffold(
        appBar: const AppTopBar(),
        body: Row(
          children: [
            AppNavigationRail(
              items: AppShellPage.navigationItems,
              currentIndex: _selectedIndex,
              onTap: _onDestinationSelected,
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
      appBar: const AppTopBar(),
      body: Padding(
        padding: const EdgeInsets.all(AppSpacing.space16),
        child: body,
      ),
      bottomNavigationBar: AppBottomNavigation(
        items: AppShellPage.navigationItems,
        currentIndex: _selectedIndex,
        onTap: _onDestinationSelected,
      ),
    );
  }
}

/// Fades [child] in whenever [index] changes, without unmounting it —
/// unlike wrapping the `IndexedStack` in a plain `FadeIn` (which only
/// plays once, on the Shell's very first build), this retriggers on
/// every destination switch, so moving between "Inicio"/"Buscar"/
/// "Órdenes"/"Mensajes"/"Perfil" reads as a soft cross-fade instead of
/// an instant cut. Deliberately keeps `IndexedStack` itself as the
/// direct child of `build()` (not recreated), so every destination's
/// scroll position/state stays preserved exactly as before.
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
