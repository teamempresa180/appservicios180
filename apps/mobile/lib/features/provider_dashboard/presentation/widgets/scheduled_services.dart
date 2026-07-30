import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/provider_dashboard_display.dart';

/// Priority #2 on the Provider Dashboard: this provider's `Accepted`
/// orders that aren't the one already shown front-and-center by
/// `ActiveServiceCard` (see `ProviderDashboardDisplay.otherActiveOrders`)
/// — a compact, less prominent list, since there's nothing to *do*
/// here yet besides wait for the scheduled date (starting the service
/// lives on the "Servicios" screen/the active-service card once it
/// becomes the most urgent one).
class ScheduledServices extends StatelessWidget {
  const ScheduledServices({super.key, required this.data});

  final ProviderDashboardDisplay data;

  String _formatDate(DateTime date) {
    final day = date.day.toString().padLeft(2, '0');
    final month = date.month.toString().padLeft(2, '0');
    return '$day/$month/${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    final scheduled = data.otherActiveOrders;
    if (scheduled.isEmpty) return const SizedBox.shrink();

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Servicios programados'),
          for (final order in scheduled)
            Padding(
              padding: const EdgeInsets.symmetric(
                vertical: AppSpacing.space4,
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.event_available_outlined,
                    size: AppSpacing.space16,
                    color: context.colors.primary,
                  ),
                  const SizedBox(width: AppSpacing.space8),
                  Expanded(
                    child: Text(
                      order.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: context.textStyles.bodyMedium,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.space8),
                  Text(
                    _formatDate(order.scheduledDate),
                    style: context.textStyles.bodySmall,
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
