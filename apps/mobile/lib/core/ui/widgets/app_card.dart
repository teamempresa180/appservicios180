import 'package:flutter/material.dart';
import '../tokens/app_elevation.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';

/// Generic content container. Purely presentational — no domain meaning.
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(AppSpacing.space16),
    this.onTap,
    this.elevation = AppElevation.level1,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;

  /// Subtle shadow depth (see `AppElevation`). Kept low by default so the
  /// card still reads as flat/neutral, with just enough lift to separate
  /// it from the background.
  final double elevation;

  @override
  Widget build(BuildContext context) {
    final card = Card(
      elevation: elevation,
      margin: EdgeInsets.zero,
      child: Padding(padding: padding, child: child),
    );

    if (onTap == null) return card;

    // Matches `AppTheme`'s `cardTheme.shape` radius (`radius20`) exactly —
    // using a different radius here (previously `radius12`) clips the
    // ink ripple to a tighter rectangle than the card's own rounded
    // border, so the ripple visibly overshoots the corners on tap.
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.radius20),
      child: card,
    );
  }
}
