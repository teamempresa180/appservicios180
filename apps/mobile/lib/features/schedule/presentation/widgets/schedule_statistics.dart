import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/schedule_display.dart';

/// Summary: per-status block counts and total open hours — all
/// **derived** from the real `Schedule` list (see `ScheduleDisplay` and
/// the feature README), no simulated field involved.
class ScheduleStatistics extends StatelessWidget {
  const ScheduleStatistics({super.key, required this.data});

  final ScheduleDisplay data;

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
              _StatTile(label: 'Bloques abiertos', value: '${data.openCount}'),
              _StatTile(
                label: 'Bloques completados',
                value: '${data.completedCount}',
              ),
              _StatTile(
                label: 'Bloques bloqueados',
                value: '${data.blockedCount}',
              ),
              _StatTile(
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
          maxLines: 2,
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
