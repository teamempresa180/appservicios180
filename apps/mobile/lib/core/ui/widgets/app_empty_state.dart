import 'package:flutter/material.dart';
import '../animations/scale_in.dart';
import '../icons/app_icons.dart';
import '../tokens/app_spacing.dart';
import 'app_button.dart';

/// Generic empty-state placeholder: icon, title, optional description and
/// an optional action (rendered as an `AppButton`). No domain meaning —
/// the caller supplies all copy, iconography and the action's behavior.
class AppEmptyState extends StatelessWidget {
  const AppEmptyState({
    super.key,
    required this.title,
    this.description,
    this.icon = AppIcons.empty,
    this.actionLabel,
    this.onActionPressed,
  });

  final String title;
  final String? description;
  final IconData icon;

  /// If both this and [onActionPressed] are set, an `AppButton` is shown
  /// below the description.
  final String? actionLabel;
  final VoidCallback? onActionPressed;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.space24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ScaleIn(
              child: Icon(
                icon,
                size: AppSpacing.space48,
                color: theme.colorScheme.secondary,
              ),
            ),
            const SizedBox(height: AppSpacing.space16),
            Text(
              title,
              textAlign: TextAlign.center,
              style: theme.textTheme.titleMedium,
            ),
            if (description != null) ...[
              const SizedBox(height: AppSpacing.space8),
              Text(
                description!,
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyMedium,
              ),
            ],
            if (actionLabel != null) ...[
              const SizedBox(height: AppSpacing.space16),
              AppButton(
                label: actionLabel!,
                onPressed: onActionPressed,
                expand: false,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
