import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
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
              _StatTile(
                label: 'Disponibilidad semanal',
                value: '${data.weeklyAvailabilityPercentage.round()}%',
              ),
              _StatTile(
                label: 'Días activos',
                value: '${data.activeDaysCount}',
              ),
              _StatTile(
                label: 'Días inactivos',
                value: '${data.inactiveDaysCount}',
              ),
              _StatTile(
                label: 'Próxima disponibilidad',
                value: data.nextAvailableLabel,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space8),
          Text(data.workingHoursLabel, style: context.textStyles.bodySmall),
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
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          value,
          maxLines: 2,
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
