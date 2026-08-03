import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/provider_dashboard_display.dart';

/// Performance recap. Every figure is **derived from real domain
/// data** — acceptance rate from the provider's own decided `quotes`,
/// completed services from the real `orders`. The former "Tiempo
/// promedio de respuesta" row is gone: nothing in the domain records
/// response latency, so it could only ever have shown a fabricated
/// value (see `ProviderDashboardDisplay`'s class doc).
///
/// "Tasa de aceptación" is hidden entirely until at least one quote
/// has actually been accepted or rejected — a brand-new provider is
/// shown a short explanation instead of a misleading 0%.
class ProviderPerformance extends StatelessWidget {
  const ProviderPerformance({super.key, required this.data});

  final ProviderDashboardDisplay data;

  @override
  Widget build(BuildContext context) {
    final acceptanceRate = data.acceptanceRate;

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Rendimiento'),
          if (acceptanceRate != null)
            _PerformanceRow(
              icon: AppIcons.success,
              label: 'Tasa de aceptación',
              value: '${(acceptanceRate * 100).round()}%',
            ),
          _PerformanceRow(
            icon: Icons.task_alt_outlined,
            label: 'Servicios completados',
            value: '${data.completedOrdersCount}',
          ),
          if (acceptanceRate == null) ...[
            const SizedBox(height: AppSpacing.space4),
            Text(
              'Tu tasa de aceptación aparecerá aquí cuando un cliente '
              'responda a tu primera cotización.',
              style: context.textStyles.bodySmall,
            ),
          ],
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
