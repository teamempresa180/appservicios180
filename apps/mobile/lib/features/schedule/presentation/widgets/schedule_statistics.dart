import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_section.dart';
import '../../../../core/ui/widgets/app_stat_grid.dart';
import '../../../../core/ui/widgets/app_stat_tile.dart';
import '../../models/schedule_display.dart';

/// Summary: per-status block counts and total open hours — all
/// **derived** from the real `Schedule` list (see `ScheduleDisplay` and
/// the feature README), no simulated field involved.
class ScheduleStatistics extends StatelessWidget {
  const ScheduleStatistics({super.key, required this.data});

  final ScheduleDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppSection(
      title: 'Resumen',
      children: [
        AppStatGrid(
          tiles: [
            AppStatTile(label: 'Bloques abiertos', value: '${data.openCount}'),
            AppStatTile(
              label: 'Bloques completados',
              value: '${data.completedCount}',
            ),
            AppStatTile(
              label: 'Bloques bloqueados',
              value: '${data.blockedCount}',
            ),
            AppStatTile(
              label: 'Bloques cancelados',
              value: '${data.cancelledCount}',
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.space8),
        Text(
          'Horas abiertas: ${data.totalOpenDuration.inHours}h',
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    );
  }
}
