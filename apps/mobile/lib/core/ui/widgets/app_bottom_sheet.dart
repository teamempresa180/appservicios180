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

  /// Fraction of the screen height a sheet may occupy at most. Below
  /// this the sheet sizes itself to its content; above it, the content
  /// scrolls instead of overflowing.
  static const double _maxHeightFactor = 0.9;

  /// Shows [child] inside a bottom sheet via `showModalBottomSheet` and
  /// returns whatever value the caller passes to `Navigator.pop`.
  ///
  /// `isScrollControlled` is required, not optional: without it
  /// `showModalBottomSheet` caps the sheet at ~half the screen height
  /// **and** refuses to grow past that cap, so the `MediaQuery
  /// .viewInsets.bottom` padding the form sheets add for the software
  /// keyboard (`AddressFormSheet`, `SubmitQuoteSheet`,
  /// `EditProfileSheet`, `ContactFormSheet`, `ServiceFormSheet`) had no
  /// room to take effect — the keyboard covered the fields it was meant
  /// to lift. With it set, the sheet is free to size to its content, and
  /// [_maxHeightFactor] + the scroll view in `build` keep a tall sheet
  /// (small phone, landscape, keyboard open) scrollable rather than
  /// overflowing.
  static Future<T?> show<T>(BuildContext context, {required Widget child}) {
    return showModalBottomSheet<T>(
      context: context,
      isScrollControlled: true,
      constraints: BoxConstraints(
        maxHeight: MediaQuery.sizeOf(context).height * _maxHeightFactor,
      ),
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
            // `Flexible` (not a plain child) so the drag handle stays
            // pinned while the content takes whatever height is left
            // under the `maxHeight` cap from `show`. The scroll view
            // then guarantees a sheet taller than that cap — long form,
            // small phone, landscape, or keyboard open — scrolls instead
            // of throwing a bottom overflow. Sheets that already bring
            // their own `SingleChildScrollView` are unaffected: they fit
            // their content exactly, so this outer view is the one that
            // actually scrolls.
            Flexible(child: SingleChildScrollView(child: child)),
          ],
        ),
      ),
    );
  }
}
