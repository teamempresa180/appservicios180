import 'package:flutter/material.dart';

/// Describes one destination of the App Shell's navigation surface
/// (bottom bar or rail — both render from the very same list). Plain
/// data only — no behavior.
///
/// [index] is the position of this destination in the shared
/// [IndexedStack] body, so selecting a destination and picking which
/// stack child to show both key off the same number.
class ShellNavigationItem {
  const ShellNavigationItem({
    required this.icon,
    required this.selectedIcon,
    required this.label,
    required this.index,
  });

  /// Icon shown when this destination is not the current selection.
  final IconData icon;

  /// Icon shown when this destination is the current selection.
  final IconData selectedIcon;

  final String label;
  final int index;
}
