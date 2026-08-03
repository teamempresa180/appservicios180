import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/provider_dashboard_display.dart';

/// Financial summary: today/week/month earnings, all **derived from
/// the provider's own completed `Payment`s** — see
/// `ProviderDashboardDisplay`. A provider with no completed payments
/// yet sees zeroes plus a one-line explanation rather than an
/// unexplained row of `$0`.
class EarningsSummary extends StatelessWidget {
  const EarningsSummary({super.key, required this.data});

  final ProviderDashboardDisplay data;

  @override
  Widget build(BuildContext context) {
    final hasEarnings = data.monthlyEarnings > 0;

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Resumen financiero'),
          Row(
            children: [
              Expanded(
                child: _EarningsColumn(
                  label: 'Hoy',
                  amount: data.todayEarnings,
                ),
              ),
              Expanded(
                child: _EarningsColumn(
                  label: 'Semana',
                  amount: data.weeklyEarnings,
                ),
              ),
              Expanded(
                child: _EarningsColumn(
                  label: 'Mes',
                  amount: data.monthlyEarnings,
                ),
              ),
            ],
          ),
          if (!hasEarnings) ...[
            const SizedBox(height: AppSpacing.space8),
            Text(
              'Aquí verás tus ingresos en cuanto se registre tu primer '
              'pago completado.',
              style: context.textStyles.bodySmall,
            ),
          ],
        ],
      ),
    );
  }
}

class _EarningsColumn extends StatelessWidget {
  const _EarningsColumn({required this.label, required this.amount});

  final String label;
  final num amount;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: context.textStyles.bodySmall,
        ),
        const SizedBox(height: AppSpacing.space4),
        Text(
          '\$$amount',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: context.textStyles.titleMedium,
        ),
      ],
    );
  }
}
