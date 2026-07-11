import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section.dart';
import '../../../../core/ui/widgets/app_stat_grid.dart';
import '../../../../core/ui/widgets/app_stat_tile.dart';
import '../../../../service/models/service_status.dart';
import '../../models/provider_service_display.dart';

/// Aggregate statistics over every `ProviderServiceDisplay` passed in.
/// "Servicios activos"/"Servicios pausados" are **derived** from the
/// real `Service.status` of each entry; "Total de solicitudes"/"Total
/// de visualizaciones" sum the **simulated** per-service
/// `viewsCount`/`requestsCount` — see `ProviderServiceDisplay` and the
/// feature README.
class ServicesStatistics extends StatelessWidget {
  const ServicesStatistics({super.key, required this.services});

  final List<ProviderServiceDisplay> services;

  @override
  Widget build(BuildContext context) {
    final activeCount = services
        .where((s) => s.service.status == ServiceStatus.active)
        .length;
    final pausedCount = services
        .where((s) => s.service.status == ServiceStatus.inactive)
        .length;
    final totalRequests = services.fold<int>(
      0,
      (sum, s) => sum + s.requestsCount,
    );
    final totalViews = services.fold<int>(0, (sum, s) => sum + s.viewsCount);

    return AppSection(
      title: 'Estadísticas',
      children: [
        AppStatGrid(
          childAspectRatio: 1.8,
          tiles: [
            AppStatTile(label: 'Servicios activos', value: '$activeCount'),
            AppStatTile(label: 'Servicios pausados', value: '$pausedCount'),
            AppStatTile(label: 'Total de solicitudes', value: '$totalRequests'),
            AppStatTile(
              label: 'Total de visualizaciones',
              value: '$totalViews',
            ),
          ],
        ),
      ],
    );
  }
}
