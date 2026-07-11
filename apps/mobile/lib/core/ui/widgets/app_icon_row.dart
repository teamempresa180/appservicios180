import 'package:flutter/material.dart';
import '../extensions/context_theme_extensions.dart';
import '../tokens/app_spacing.dart';

/// A leading icon + title (optionally with a subtitle) + optional
/// trailing widget — the "icon row" shape repeated across card/list
/// widgets (`CredentialCard`, `AuditLogEntryCard`, `TrustFactorCard`,
/// `VerificationStepCard`, and the `Row` inside `ContactCard`/
/// `AuthMethodCard`/`ScheduleBlockCard`).
///
/// [padded] (default `true`) wraps the row in the same vertical
/// `Padding` those bare-list-item widgets used; pass `false` when the
/// row already sits inside an `AppCard` (which supplies its own
/// padding).
class AppIconRow extends StatelessWidget {
  const AppIconRow({
    super.key,
    required this.icon,
    required this.title,
    this.subtitle,
    this.trailing,
    this.iconColor,
    this.iconSize = AppSpacing.space20,
    this.padded = true,
    this.verticalPadding = AppSpacing.space4,
    this.crossAxisAlignment = CrossAxisAlignment.center,
  });

  final IconData icon;
  final String title;
  final String? subtitle;
  final Widget? trailing;
  final Color? iconColor;
  final double? iconSize;
  final bool padded;
  final double verticalPadding;
  final CrossAxisAlignment crossAxisAlignment;

  @override
  Widget build(BuildContext context) {
    final textStyles = context.textStyles;

    final row = Row(
      crossAxisAlignment: crossAxisAlignment,
      children: [
        Icon(icon, size: iconSize, color: iconColor ?? context.colors.primary),
        const SizedBox(width: AppSpacing.space8),
        Expanded(
          child: subtitle == null
              ? Text(
                  title,
                  overflow: TextOverflow.ellipsis,
                  style: textStyles.bodyMedium,
                )
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: textStyles.bodyMedium),
                    Text(subtitle!, style: textStyles.bodySmall),
                  ],
                ),
        ),
        ?trailing,
      ],
    );

    if (!padded) return row;

    return Padding(
      padding: EdgeInsets.symmetric(vertical: verticalPadding),
      child: row,
    );
  }
}
