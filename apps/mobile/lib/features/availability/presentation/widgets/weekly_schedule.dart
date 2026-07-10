import 'package:flutter/material.dart';
import '../../../../availability/entities/availability.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import 'day_schedule_card.dart';

/// Vertical list of `DayScheduleCard`s, sorted Monday → Sunday by the
/// real `Availability.availableFrom.weekday`.
class WeeklySchedule extends StatelessWidget {
  const WeeklySchedule({super.key, required this.availabilities});

  final List<Availability> availabilities;

  @override
  Widget build(BuildContext context) {
    final sorted = [...availabilities]
      ..sort(
        (a, b) => a.availableFrom.weekday.compareTo(b.availableFrom.weekday),
      );

    return Column(
      children: [
        for (final availability in sorted) ...[
          DayScheduleCard(availability: availability),
          const SizedBox(height: AppSpacing.space8),
        ],
      ],
    );
  }
}
