import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_section.dart';
import '../../../../core/ui/widgets/app_stat_grid.dart';
import '../../../../core/ui/widgets/app_stat_tile.dart';
import '../../models/availability_display.dart';

/// Summary: weekly availability percentage, active/inactive days
/// (**derived** from the real `Availability.status` of every day —
/// see `AvailabilityDisplay` and the feature README) plus the next
/// available slot (**simulated**).
class AvailabilityStatistics extends StatelessWidget {
  const AvailabilityStatistics({super.key, required this.data});

  final AvailabilityDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppSection(
      title: 'Resumen',
      children: [
        AppStatGrid(
          tiles: [
            AppStatTile(
              label: 'Disponibilidad semanal',
              value: '${data.weeklyAvailabilityPercentage.round()}%',
            ),
            AppStatTile(
              label: 'Días activos',
              value: '${data.activeDaysCount}',
            ),
            AppStatTile(
              label: 'Días inactivos',
              value: '${data.inactiveDaysCount}',
            ),
            AppStatTile(
              label: 'Próxima disponibilidad',
              value: data.nextAvailableLabel,
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.space8),
        Text(data.workingHoursLabel, style: context.textStyles.bodySmall),
      ],
    );
  }
}
