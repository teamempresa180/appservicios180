import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/provider_dashboard_display.dart';

/// Priority #3 on the Provider Dashboard: still-`Pending` orders this
/// provider hasn't quoted yet (`ProviderDashboardDisplay
/// .newRequestOrders`) — new work available to bid on, including open
/// requests in this provider's own category since `orders` comes from
/// `GET /orders/relevant-for-provider` (see
/// `HttpProviderDashboardRepository.getOrders`). Purely visual — no
/// action here; submitting a Quote for one of these lives on the
/// "Servicios" screen (`ProviderRequestsPage`), reached via
/// [onViewAll].
class PendingRequests extends StatelessWidget {
  const PendingRequests({super.key, required this.data, this.onViewAll});

  final ProviderDashboardDisplay data;
  final VoidCallback? onViewAll;

  @override
  Widget build(BuildContext context) {
    final pending = data.newRequestOrders;

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppSectionTitle(
            title: 'Nuevas solicitudes',
            actionLabel: pending.isEmpty ? null : 'Ver todas',
            onActionTap: pending.isEmpty ? null : onViewAll,
          ),
          if (pending.isEmpty)
            Text(
              'No tienes solicitudes nuevas por cotizar.',
              style: context.textStyles.bodySmall,
            )
          else
            for (final order in pending) ...[
              Padding(
                padding: const EdgeInsets.symmetric(
                  vertical: AppSpacing.space4,
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.pending_actions_outlined,
                      size: AppSpacing.space16,
                      color: context.colors.secondary,
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
                  ],
                ),
              ),
            ],
        ],
      ),
    );
  }
}
