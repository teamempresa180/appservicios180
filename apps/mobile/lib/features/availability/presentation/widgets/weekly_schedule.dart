import 'package:flutter/material.dart';
import '../../../../availability/entities/availability.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import 'day_schedule_card.dart';

/// Vertical list of `DayScheduleCard`s, sorted Monday → Sunday by the
/// real `Availability.availableFrom.weekday`, entering with a
/// staggered fade+slide (see `staggerDelayFor`).
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
        for (final (index, availability) in sorted.indexed) ...[
          FadeIn(
            delay: staggerDelayFor(index),
            child: SlideIn(child: DayScheduleCard(availability: availability)),
          ),
          const SizedBox(height: AppSpacing.space8),
        ],
      ],
    );
  }
}
