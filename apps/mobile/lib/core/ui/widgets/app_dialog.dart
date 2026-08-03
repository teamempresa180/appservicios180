import 'package:flutter/material.dart';
import '../tokens/app_elevation.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';

/// Generic modal dialog (see `BRANDING.md`, "Diálogos"): Surface
/// background (inherited from the theme's `DialogThemeData`/default
/// `Colors.surface`), radius 16, elevation `level8`, capped at 400px
/// wide. No domain meaning — the caller supplies title/content/actions.
///
/// Use [AppDialog.show] rather than constructing this widget directly
/// — it wraps `showDialog` so callers don't need to know the barrier
/// or builder boilerplate.
class AppDialog extends StatelessWidget {
  const AppDialog({super.key, this.title, required this.content, this.actions});

  final String? title;
  final Widget content;
  final List<Widget>? actions;

  /// Keeps the dialog from stretching edge-to-edge on a tablet.
  static const double _maxWidth = 400;

  /// Fraction of the screen height a dialog may occupy at most; past
  /// this the body scrolls.
  static const double _maxHeightFactor = 0.8;

  /// Shows this dialog via `showDialog` and returns whatever value the
  /// caller passes to `Navigator.pop`.
  static Future<T?> show<T>(
    BuildContext context, {
    String? title,
    required Widget content,
    List<Widget>? actions,
  }) {
    return showDialog<T>(
      context: context,
      builder: (context) =>
          AppDialog(title: title, content: content, actions: actions),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      elevation: AppElevation.level8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.radius16),
      ),
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: _maxWidth,
          // Landscape phones and keyboard-open states leave very little
          // vertical room; without a cap a dialog with a long body
          // overflows the screen. Capping it and scrolling the body
          // below keeps the title and actions reachable instead.
          maxHeight: MediaQuery.sizeOf(context).height * _maxHeightFactor,
        ),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.space24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (title != null) ...[
                Text(title!, style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: AppSpacing.space16),
              ],
              // Only the body scrolls — the title stays put at the top
              // and the actions stay reachable at the bottom.
              Flexible(child: SingleChildScrollView(child: content)),
              if (actions != null) ...[
                const SizedBox(height: AppSpacing.space24),
                // `Wrap`, not `Row`: two buttons with long Spanish
                // labels ("Cancelar" + "Confirmar eliminación") exceed
                // the dialog width on a small phone and a `Row` would
                // throw a horizontal overflow. `Wrap` drops the actions
                // onto a second line instead.
                Wrap(
                  alignment: WrapAlignment.end,
                  spacing: AppSpacing.space8,
                  runSpacing: AppSpacing.space8,
                  children: actions!,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
