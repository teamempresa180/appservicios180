import 'package:flutter/material.dart';
import '../models/shell_navigation_item.dart';

/// Resolves a [ShellNavigationItem] into the icon it should show for a
/// given selection state. Both [AppBottomNavigation] and
/// [AppNavigationRail] build their destinations through this single
/// widget, so the icon/selectedIcon rule lives in exactly one place
/// instead of being duplicated across the two navigation surfaces.
class NavigationDestinationItem extends StatelessWidget {
  const NavigationDestinationItem({
    super.key,
    required this.item,
    required this.isSelected,
  });

  final ShellNavigationItem item;
  final bool isSelected;

  @override
  Widget build(BuildContext context) {
    return Icon(isSelected ? item.selectedIcon : item.icon);
  }
}
