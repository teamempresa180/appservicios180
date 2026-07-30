import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_badge.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/provider_dashboard_display.dart';

/// Priority #4 on the Provider Dashboard: `Pending` orders this
/// provider already quoted (`ProviderDashboardDisplay
/// .pendingQuoteOrders`) — purely informational, waiting on the
/// client's decision, so it sits lower than "Nuevas solicitudes"
/// (there's nothing to act on here). Renders nothing when empty.
class PendingQuotes extends StatelessWidget {
  const PendingQuotes({super.key, required this.data});

  final ProviderDashboardDisplay data;

  @override
  Widget build(BuildContext context) {
    final waiting = data.pendingQuoteOrders;
    if (waiting.isEmpty) return const SizedBox.shrink();

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Cotizaciones enviadas'),
          for (final order in waiting)
            Padding(
              padding: const EdgeInsets.symmetric(
                vertical: AppSpacing.space4,
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      order.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: context.textStyles.bodyMedium,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.space8),
                  const AppBadge(
                    label: 'Esperando al cliente',
                    tone: AppBadgeTone.info,
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
