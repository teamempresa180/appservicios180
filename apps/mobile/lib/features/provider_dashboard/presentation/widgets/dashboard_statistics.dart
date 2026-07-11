import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_stat_tile.dart';
import '../../models/provider_dashboard_display.dart';

/// Order/rating statistics. `activeOrdersCount`/`completedOrdersCount`/
/// `pendingRequestsCount`/`averageRating` are all **derived** from the
/// real `orders`/`reviews` — see `ProviderDashboardDisplay` and the
/// feature README.
class DashboardStatistics extends StatelessWidget {
  const DashboardStatistics({super.key, required this.data});

  final ProviderDashboardDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Estadísticas'),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 2.4,
            mainAxisSpacing: AppSpacing.space8,
            crossAxisSpacing: AppSpacing.space8,
            children: [
              AppStatTile(
                label: 'Órdenes activas',
                value: '${data.activeOrdersCount}',
              ),
              AppStatTile(
                label: 'Órdenes finalizadas',
                value: '${data.completedOrdersCount}',
              ),
              AppStatTile(
                label: 'Solicitudes pendientes',
                value: '${data.pendingRequestsCount}',
              ),
              AppStatTile(
                label: 'Calificación promedio',
                value: data.averageRating.toStringAsFixed(1),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
