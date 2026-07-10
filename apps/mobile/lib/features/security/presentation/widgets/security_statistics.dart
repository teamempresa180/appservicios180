import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/security_display.dart';

/// Summary: per-status auth method counts — all **derived** from the
/// real `Authentication` list (see `SecurityDisplay` and the feature
/// README), no simulated field involved.
class SecurityStatistics extends StatelessWidget {
  const SecurityStatistics({super.key, required this.data});

  final SecurityDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Resumen'),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 1.7,
            mainAxisSpacing: AppSpacing.space8,
            crossAxisSpacing: AppSpacing.space8,
            children: [
              _StatTile(label: 'Activos', value: '${data.activeCount}'),
              _StatTile(label: 'Inactivos', value: '${data.inactiveCount}'),
              _StatTile(label: 'Bloqueados', value: '${data.lockedCount}'),
              _StatTile(label: 'Revocados', value: '${data.revokedCount}'),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  const _StatTile({required this.label, required this.value});

  final String label;
  final String value;

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
