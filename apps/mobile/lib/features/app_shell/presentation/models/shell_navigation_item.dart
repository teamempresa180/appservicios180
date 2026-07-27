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
    this.opensDrawer = false,
  });

  /// Icon shown when this destination is not the current selection.
  final IconData icon;

  /// Icon shown when this destination is the current selection.
  final IconData selectedIcon;

  final String label;
  final int index;

  /// When `true`, selecting this destination opens the App Shell's
  /// drawer instead of switching the [IndexedStack] to [index] — it
  /// never becomes the "current" destination, so it never renders as
  /// selected. Used for the "Menú" destination, which is a trigger
  /// rather than a real tab.
  final bool opensDrawer;
}
