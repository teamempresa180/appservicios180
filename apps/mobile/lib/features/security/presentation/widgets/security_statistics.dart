import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_stat_tile.dart';
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
              AppStatTile(label: 'Activos', value: '${data.activeCount}'),
              AppStatTile(label: 'Inactivos', value: '${data.inactiveCount}'),
              AppStatTile(label: 'Bloqueados', value: '${data.lockedCount}'),
              AppStatTile(label: 'Revocados', value: '${data.revokedCount}'),
            ],
          ),
        ],
      ),
    );
  }
}
