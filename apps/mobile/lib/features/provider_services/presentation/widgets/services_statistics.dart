import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
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

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Estadísticas'),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 1.8,
            mainAxisSpacing: AppSpacing.space8,
            crossAxisSpacing: AppSpacing.space8,
            children: [
              _StatTile(label: 'Servicios activos', value: '$activeCount'),
              _StatTile(label: 'Servicios pausados', value: '$pausedCount'),
              _StatTile(label: 'Total de solicitudes', value: '$totalRequests'),
              _StatTile(
                label: 'Total de visualizaciones',
                value: '$totalViews',
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  const _StatTile({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(value, style: context.textStyles.titleMedium),
        Text(
          label,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: context.textStyles.bodySmall,
        ),
      ],
    );
  }
}
