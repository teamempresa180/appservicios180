import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section.dart';
import '../../../../core/ui/widgets/app_stat_grid.dart';
import '../../../../core/ui/widgets/app_stat_tile.dart';
import '../../../../service/models/service_status.dart';
import '../../models/provider_service_display.dart';

/// Aggregate statistics over every `ProviderServiceDisplay` passed in
/// — all four tiles **derived** from the real `Service.status`.
///
/// The former "Total de solicitudes"/"Total de visualizaciones" tiles
/// were removed along with the simulated per-service counters that
/// backed them (see `ProviderServiceDisplay`'s class doc); they are
/// replaced by the archived count and the real total, which the
/// provider can actually verify against the list right below.
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
    final archivedCount = services
        .where((s) => s.service.status == ServiceStatus.archived)
        .length;

    return AppSection(
      title: 'Estadísticas',
      children: [
        AppStatGrid(
          childAspectRatio: 1.8,
          tiles: [
            AppStatTile(label: 'Servicios activos', value: '$activeCount'),
            AppStatTile(label: 'Servicios pausados', value: '$pausedCount'),
            AppStatTile(label: 'Servicios archivados', value: '$archivedCount'),
            AppStatTile(
              label: 'Total de servicios',
              value: '${services.length}',
            ),
          ],
        ),
      ],
    );
  }
}
