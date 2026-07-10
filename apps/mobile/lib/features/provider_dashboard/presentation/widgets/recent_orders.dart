import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../order/models/order_status.dart';
import '../../models/provider_dashboard_display.dart';

/// Recap of the most recent real `Order`s (up to 3). Purely visual —
/// no lookup by ID, no navigation to order detail yet (see the feature
/// README).
class RecentOrders extends StatelessWidget {
  const RecentOrders({super.key, required this.data});

  final ProviderDashboardDisplay data;

  String _statusLabel(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return 'Pendiente';
      case OrderStatus.accepted:
        return 'Aceptada';
      case OrderStatus.inProgress:
        return 'En progreso';
      case OrderStatus.completed:
        return 'Finalizada';
      case OrderStatus.cancelled:
        return 'Cancelada';
      case OrderStatus.rejected:
        return 'Rechazada';
    }
  }

  @override
  Widget build(BuildContext context) {
    final recent = data.orders.take(3).toList();

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Órdenes recientes'),
          for (final order in recent) ...[
            Padding(
              padding: const EdgeInsets.symmetric(vertical: AppSpacing.space4),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      order.title,
                      style: context.textStyles.bodyMedium,
                    ),
                  ),
                  Text(
                    _statusLabel(order.status),
                    style: context.textStyles.bodySmall,
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
