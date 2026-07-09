import 'package:flutter/material.dart';
import '../../../../availability/entities/availability.dart';
import '../../../../availability/models/availability_status.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// The provider's general `Availability` (real domain entity) — status,
/// type and hour range. Purely visual, no scheduling/booking.
class ProviderAvailability extends StatelessWidget {
  const ProviderAvailability({super.key, required this.availability});

  final Availability availability;

  String _timeOfDay(DateTime time) {
    final hour = time.hour.toString().padLeft(2, '0');
    final minute = time.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  @override
  Widget build(BuildContext context) {
    final isActive = availability.status == AvailabilityStatus.active;

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Disponibilidad'),
          Row(
            children: [
              Icon(
                isActive ? Icons.check_circle_outline : Icons.cancel_outlined,
                color: context.colors.primary,
              ),
              const SizedBox(width: AppSpacing.space8),
              Text(
                isActive ? 'Disponible' : 'No disponible',
                style: context.textStyles.bodyMedium,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space4),
          Text(
            '${_timeOfDay(availability.availableFrom)} - '
            '${_timeOfDay(availability.availableTo)}',
            style: context.textStyles.bodySmall,
          ),
        ],
      ),
    );
  }
}
