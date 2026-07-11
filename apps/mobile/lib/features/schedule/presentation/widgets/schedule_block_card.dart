import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_badge.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../schedule/entities/schedule.dart';
import '../../../../schedule/models/schedule_status.dart';
import '../../../../schedule/models/schedule_type.dart';

/// A single real `Schedule` block: day name (derived from
/// `startDateTime.weekday`, same approach as `DayScheduleCard` in
/// `availability`), time range, type and status badge. No color/icon
/// stored anywhere — resolved here from `context.colors.*`.
class ScheduleBlockCard extends StatelessWidget {
  const ScheduleBlockCard({super.key, required this.schedule});

  final Schedule schedule;

  static const _dayNames = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  String get _dayName => _dayNames[schedule.startDateTime.weekday - 1];

  String _formatTime(DateTime time) {
    final hour = time.hour.toString().padLeft(2, '0');
    final minute = time.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  String _typeLabel(ScheduleType type) {
    switch (type) {
      case ScheduleType.regular:
        return 'Regular';
      case ScheduleType.blocked:
        return 'Bloqueado';
      case ScheduleType.special:
        return 'Especial';
      case ScheduleType.other:
        return 'Otro';
    }
  }

  String _statusLabel(ScheduleStatus status) {
    switch (status) {
      case ScheduleStatus.open:
        return 'Abierto';
      case ScheduleStatus.blocked:
        return 'Bloqueado';
      case ScheduleStatus.cancelled:
        return 'Cancelado';
      case ScheduleStatus.completed:
        return 'Completado';
    }
  }

  Color _statusColor(BuildContext context, ScheduleStatus status) {
    switch (status) {
      case ScheduleStatus.open:
        return context.colors.primary;
      case ScheduleStatus.completed:
        return context.colors.secondary;
      case ScheduleStatus.blocked:
      case ScheduleStatus.cancelled:
        return context.colors.error;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _statusColor(context, schedule.status);

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
                Text(
                  '${_formatTime(schedule.startDateTime)} - '
                  '${_formatTime(schedule.endDateTime)}',
                  style: context.textStyles.bodyMedium,
                ),
                const SizedBox(height: AppSpacing.space4),
                Text(
                  _typeLabel(schedule.type),
                  style: context.textStyles.bodySmall,
                ),
              ],
            ),
          ),
          AppBadge(label: _statusLabel(schedule.status), color: color),
        ],
      ),
    );
  }
}
