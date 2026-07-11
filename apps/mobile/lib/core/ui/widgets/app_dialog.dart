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
        constraints: const BoxConstraints(maxWidth: 400),
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
              content,
              if (actions != null) ...[
                const SizedBox(height: AppSpacing.space24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    for (final action in actions!) ...[
                      action,
                      if (action != actions!.last)
                        const SizedBox(width: AppSpacing.space8),
                    ],
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
