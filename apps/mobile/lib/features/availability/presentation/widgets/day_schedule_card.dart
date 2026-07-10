import 'package:flutter/material.dart';
import '../../../../availability/entities/availability.dart';
import '../../../../availability/models/availability_status.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import 'time_slot.dart';

/// A single day's schedule: day name (derived from the real
/// `Availability.availableFrom.weekday` — see `AvailabilityDisplay`'s
/// class doc), "Disponible"/"No disponible" (derived from the real
/// `Availability.status`) and its hora inicio/fin (`TimeSlot`). No
/// color/icon stored anywhere — resolved from `context.colors.*` here.
class DayScheduleCard extends StatelessWidget {
  const DayScheduleCard({super.key, required this.availability});

  final Availability availability;

  static const _dayNames = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  String get _dayName => _dayNames[availability.availableFrom.weekday - 1];

  @override
  Widget build(BuildContext context) {
    final isAvailable = availability.status == AvailabilityStatus.active;

    return AppCard(
      child: Row(
        children: [
          SizedBox(
            width: 76,
            child: Text(
              _dayName,
              overflow: TextOverflow.ellipsis,
              style: context.textStyles.titleSmall,
            ),
          ),
          const SizedBox(width: AppSpacing.space8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      isAvailable
                          ? Icons.check_circle_outline
                          : Icons.cancel_outlined,
                      size: AppSpacing.space16,
                      color: isAvailable
                          ? context.colors.primary
                          : context.colors.error,
                    ),
                    const SizedBox(width: AppSpacing.space4),
                    Flexible(
                      child: Text(
                        isAvailable ? 'Disponible' : 'No disponible',
                        overflow: TextOverflow.ellipsis,
                        style: context.textStyles.bodyMedium,
                      ),
                    ),
                  ],
                ),
                if (isAvailable) ...[
                  const SizedBox(height: AppSpacing.space4),
                  TimeSlot(availability: availability),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
