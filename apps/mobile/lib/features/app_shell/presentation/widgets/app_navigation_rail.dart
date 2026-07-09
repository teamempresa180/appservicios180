import 'package:flutter/material.dart';
import '../models/shell_navigation_item.dart';
import 'navigation_destination_item.dart';

/// Side navigation used by the App Shell on wide (tablet/desktop)
/// screens — renders from the exact same [ShellNavigationItem] list as
/// [AppBottomNavigation], just laid out differently. Purely visual and
/// local — [onTap] only reports the tapped index, it does not navigate
/// via GoRouter (see the feature README).
class AppNavigationRail extends StatelessWidget {
  const AppNavigationRail({
    super.key,
    required this.items,
    required this.currentIndex,
    required this.onTap,
  });

  final List<ShellNavigationItem> items;
  final int currentIndex;
  final ValueChanged<int> onTap;

  @override
  Widget build(BuildContext context) {
    return NavigationRail(
      selectedIndex: currentIndex,
      onDestinationSelected: onTap,
      labelType: NavigationRailLabelType.all,
      destinations: [
        for (final item in items)
          NavigationRailDestination(
            icon: NavigationDestinationItem(item: item, isSelected: false),
            selectedIcon: NavigationDestinationItem(
              item: item,
              isSelected: true,
            ),
            label: Text(item.label),
          ),
      ],
    );
  }
}
