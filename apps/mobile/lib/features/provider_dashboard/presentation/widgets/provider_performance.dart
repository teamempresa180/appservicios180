import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/provider_dashboard_display.dart';

/// Performance recap: average response time and acceptance rate
/// (**fully simulated**, see `ProviderDashboardDisplay` and the
/// feature README) plus completed services (**derived**, not
/// simulated, from the real `orders`).
class ProviderPerformance extends StatelessWidget {
  const ProviderPerformance({super.key, required this.data});

  final ProviderDashboardDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Rendimiento'),
          _PerformanceRow(
            icon: Icons.timer_outlined,
            label: 'Tiempo promedio de respuesta',
            value: data.averageResponseTime,
          ),
          _PerformanceRow(
            icon: Icons.check_circle_outline,
            label: 'Tasa de aceptación',
            value: '${(data.acceptanceRate * 100).round()}%',
          ),
          _PerformanceRow(
            icon: Icons.task_alt_outlined,
            label: 'Servicios completados',
            value: '${data.completedOrdersCount}',
          ),
        ],
      ),
    );
  }
}

class _PerformanceRow extends StatelessWidget {
  const _PerformanceRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: AppSpacing.space16, color: context.colors.primary),
          const SizedBox(width: AppSpacing.space8),
          Expanded(child: Text(label, style: context.textStyles.bodyMedium)),
          const SizedBox(width: AppSpacing.space8),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: context.textStyles.titleSmall,
            ),
          ),
        ],
      ),
    );
  }
}
