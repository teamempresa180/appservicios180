import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/provider_dashboard_display.dart';

/// List of the real `Order`s pending acceptance
/// (`ProviderDashboardDisplay.pendingOrders`, derived from `orders` —
/// see the feature README). Purely visual — no accept/reject action
/// yet.
class PendingRequests extends StatelessWidget {
  const PendingRequests({super.key, required this.data});

  final ProviderDashboardDisplay data;

  @override
  Widget build(BuildContext context) {
    final pending = data.pendingOrders;

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Solicitudes pendientes'),
          if (pending.isEmpty)
            Text(
              'No tienes solicitudes pendientes.',
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
