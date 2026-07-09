import 'package:flutter/material.dart';
import '../tokens/app_spacing.dart';

/// Generic section heading used to group content within a screen.
/// No domain meaning — the caller supplies the text.
///
/// [trailing] takes precedence if provided; otherwise, passing both
/// [actionLabel] and [onActionTap] renders a standard "Ver todo"-style
/// `TextButton` in its place, so call sites don't have to build that
/// button by hand every time.
class AppSectionTitle extends StatelessWidget {
  const AppSectionTitle({
    super.key,
    required this.title,
    this.subtitle,
    this.trailing,
    this.actionLabel,
    this.onActionTap,
  });

  final String title;
  final String? subtitle;
  final Widget? trailing;
  final String? actionLabel;
  final VoidCallback? onActionTap;

  @override
  Widget build(BuildContext context) {
    final effectiveTrailing =
        trailing ??
        (actionLabel == null
            ? null
            : TextButton(onPressed: onActionTap, child: Text(actionLabel!)));

    final textStyles = Theme.of(context).textTheme;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: textStyles.titleMedium),
                if (subtitle != null) ...[
                  const SizedBox(height: AppSpacing.space4),
                  Text(subtitle!, style: textStyles.bodySmall),
                ],
              ],
            ),
          ),
          ?effectiveTrailing,
        ],
      ),
    );
  }
}
