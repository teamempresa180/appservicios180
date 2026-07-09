import 'package:flutter/material.dart';
import '../models/shell_navigation_item.dart';
import 'navigation_destination_item.dart';

/// Bottom navigation used by the App Shell on narrow (mobile) screens.
/// Purely visual and local — [onTap] only reports the tapped index, it
/// does not navigate via GoRouter (see the feature README).
class AppBottomNavigation extends StatelessWidget {
  const AppBottomNavigation({
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
    return NavigationBar(
      selectedIndex: currentIndex,
      onDestinationSelected: onTap,
      destinations: [
        for (final item in items)
          NavigationDestination(
            icon: NavigationDestinationItem(item: item, isSelected: false),
            selectedIcon: NavigationDestinationItem(
              item: item,
              isSelected: true,
            ),
            label: item.label,
          ),
      ],
    );
  }
}
