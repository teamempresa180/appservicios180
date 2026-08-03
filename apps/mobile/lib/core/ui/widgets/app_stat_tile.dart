import 'package:flutter/material.dart';
import '../extensions/context_theme_extensions.dart';
import '../tokens/app_spacing.dart';

/// A value stacked above/below its label — the generic "statistic
/// tile" pattern. Extracted (Sprint 2 — visual audit, then adopted
/// globally in Etapa 3) from the seven features (`security`,
/// `contact_management`, `schedule`, `provider_services`,
/// `availability`, `provider_dashboard`, `provider_profile`) that each
/// reimplemented their own private `_StatTile`.
///
/// Two layouts, matching the two shapes those seven private widgets
/// actually had:
/// - **No [icon]** (six of the seven): value above label, left-aligned
///   — the default.
/// - **With [icon]** (`provider_profile`'s variant): icon above value
///   above label, all centered — the only one of the seven that wasn't
///   visually identical to the rest.
class AppStatTile extends StatelessWidget {
  const AppStatTile({
    super.key,
    required this.value,
    required this.label,
    this.icon,
  });

  final String value;
  final String label;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    if (icon != null) {
      // `mainAxisSize.min` + a bounded label, matching the no-icon
      // branch below: these tiles sit in `AppStatGrid` cells whose
      // height is fixed by `childAspectRatio`, so an unbounded label
      // (or a bumped system font scale) overflowed the cell. The
      // no-icon branch already guarded against this; this one didn't.
      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: context.colors.primary),
          const SizedBox(height: AppSpacing.space4),
          Text(
            value,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: context.textStyles.titleSmall,
          ),
          Text(
            label,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: context.textStyles.bodySmall,
          ),
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          value,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: context.textStyles.titleSmall,
        ),
        Text(
          label,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: context.textStyles.bodySmall,
        ),
      ],
    );
  }
}
