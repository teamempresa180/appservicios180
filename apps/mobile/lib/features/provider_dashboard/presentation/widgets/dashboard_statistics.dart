import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section.dart';
import '../../../../core/ui/widgets/app_stat_grid.dart';
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
    return AppSection(
      title: 'Estadísticas',
      children: [
        AppStatGrid(
          childAspectRatio: 2.4,
          tiles: [
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
    );
  }
}
