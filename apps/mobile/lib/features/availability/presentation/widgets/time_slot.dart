import 'package:flutter/material.dart';
import '../../../../availability/entities/availability.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// Formats a single real `Availability`'s hora inicio/fin
/// (`availableFrom`/`availableTo`). Purely visual — no color/icon
/// stored anywhere, resolved here from `context.colors.*`.
class TimeSlot extends StatelessWidget {
  const TimeSlot({super.key, required this.availability});

  final Availability availability;

  String _formatTime(DateTime time) {
    final hour = time.hour.toString().padLeft(2, '0');
    final minute = time.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          Icons.access_time_outlined,
          size: AppSpacing.space16,
          color: context.colors.secondary,
        ),
        const SizedBox(width: AppSpacing.space4),
        Text(
          '${_formatTime(availability.availableFrom)} - '
          '${_formatTime(availability.availableTo)}',
          style: context.textStyles.bodySmall,
        ),
      ],
    );
  }
}
