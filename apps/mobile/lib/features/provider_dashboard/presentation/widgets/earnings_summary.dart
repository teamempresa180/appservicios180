import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/provider_dashboard_display.dart';

/// Financial summary: today/week/month earnings.
/// `todayEarnings`/`weeklyEarnings`/`monthlyEarnings` are **fully
/// simulated** — see `ProviderDashboardDisplay` and the feature
/// README.
class EarningsSummary extends StatelessWidget {
  const EarningsSummary({super.key, required this.data});

  final ProviderDashboardDisplay data;

  @override
  Widget build(BuildContext context) {
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
        Text(label, style: context.textStyles.bodySmall),
        const SizedBox(height: AppSpacing.space4),
        Text('\$$amount', style: context.textStyles.titleMedium),
      ],
    );
  }
}
