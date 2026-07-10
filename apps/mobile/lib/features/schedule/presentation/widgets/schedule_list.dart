import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../schedule/entities/schedule.dart';
import 'schedule_block_card.dart';

/// Renders every real `Schedule` block via `ScheduleBlockCard`, sorted
/// by `startDateTime`.
class ScheduleList extends StatelessWidget {
  const ScheduleList({super.key, required this.schedules});

  final List<Schedule> schedules;

  @override
  Widget build(BuildContext context) {
    final sorted = [...schedules]
      ..sort((a, b) => a.startDateTime.compareTo(b.startDateTime));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const AppSectionTitle(title: 'Bloques de la semana'),
        for (final schedule in sorted) ...[
          ScheduleBlockCard(schedule: schedule),
          const SizedBox(height: AppSpacing.space8),
        ],
      ],
    );
  }
}
