import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
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
              _StatTile(
                label: 'Órdenes activas',
                value: '${data.activeOrdersCount}',
              ),
              _StatTile(
                label: 'Órdenes finalizadas',
                value: '${data.completedOrdersCount}',
              ),
              _StatTile(
                label: 'Solicitudes pendientes',
                value: '${data.pendingRequestsCount}',
              ),
              _StatTile(
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

class _StatTile extends StatelessWidget {
  const _StatTile({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(value, style: context.textStyles.titleMedium),
        Text(label, style: context.textStyles.bodySmall),
      ],
    );
  }
}
