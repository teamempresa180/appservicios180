import 'package:flutter/material.dart';

/// A value stacked above its label — the generic "statistic tile"
/// pattern. Extracted (Sprint 2, Etapa 2 — visual audit) from seven
/// features (`security`, `contact_management`, `schedule`,
/// `provider_services`, `availability`, `provider_dashboard`,
/// `provider_profile`) that each reimplemented an identical private
/// `_StatTile` widget. **Those seven files were left untouched** —
/// retrofitting them to use this widget instead is layout-adjacent
/// feature work reserved for a later Etapa (see `BRANDING.md`).
class AppStatTile extends StatelessWidget {
  const AppStatTile({super.key, required this.value, required this.label});

  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    final textStyles = Theme.of(context).textTheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          value,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: textStyles.titleSmall,
        ),
        Text(
          label,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: textStyles.bodySmall,
        ),
      ],
    );
  }
}
