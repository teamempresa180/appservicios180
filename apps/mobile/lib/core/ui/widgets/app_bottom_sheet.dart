import 'package:flutter/material.dart';
import '../extensions/context_theme_extensions.dart';
import '../tokens/app_elevation.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';

/// Generic modal bottom sheet (see `BRANDING.md`, "Bottom Sheets"):
/// rounded top corners (radius 20), a drag handle, elevation `level4`.
/// No domain meaning — the caller supplies the content.
///
/// Use [AppBottomSheet.show] rather than constructing this widget
/// directly — it wraps `showModalBottomSheet` with the official shape/
/// elevation so callers don't repeat that boilerplate per screen.
class AppBottomSheet extends StatelessWidget {
  const AppBottomSheet({super.key, required this.child});

  final Widget child;

  /// Shows [child] inside a bottom sheet via `showModalBottomSheet` and
  /// returns whatever value the caller passes to `Navigator.pop`.
  static Future<T?> show<T>(BuildContext context, {required Widget child}) {
    return showModalBottomSheet<T>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(AppRadius.radius20),
        ),
      ),
      elevation: AppElevation.level4,
      builder: (context) => AppBottomSheet(child: child),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.space16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: AppSpacing.space32,
              height: AppSpacing.space4,
              decoration: BoxDecoration(
                color: context.colors.outline,
                borderRadius: BorderRadius.circular(AppRadius.radiusPill),
              ),
            ),
            const SizedBox(height: AppSpacing.space16),
            child,
          ],
        ),
      ),
    );
  }
}
