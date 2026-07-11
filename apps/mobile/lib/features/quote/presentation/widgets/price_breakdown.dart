import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_divider.dart';
import '../../../../core/ui/widgets/app_info_row.dart';
import '../../../../core/ui/widgets/app_section.dart';
import '../../models/quote_data.dart';

/// Cost breakdown: subtotal (real, `Quote.proposedPrice`), travel fee,
/// discount and taxes (simulated), and total (derived). See `QuoteData`
/// and the feature README for what is real/simulated/derived.
class PriceBreakdown extends StatelessWidget {
  const PriceBreakdown({super.key, required this.data});

  final QuoteData data;

  String _formatAmount(num amount) {
    return amount < 0
        ? '-\$${(-amount).toStringAsFixed(2)}'
        : '\$${amount.toStringAsFixed(2)}';
  }

  @override
  Widget build(BuildContext context) {
    return AppSection(
      title: 'Desglose de costos',
      children: [
        AppInfoRow(
          label: 'Subtotal',
          value: _formatAmount(data.subtotal),
          valueStyle: context.textStyles.bodyMedium,
          padded: true,
        ),
        AppInfoRow(
          label: 'Desplazamiento',
          value: _formatAmount(data.travelFee),
          valueStyle: context.textStyles.bodyMedium,
          padded: true,
        ),
        AppInfoRow(
          label: 'Descuento',
          value: _formatAmount(-data.discount),
          valueStyle: context.textStyles.bodyMedium,
          padded: true,
        ),
        AppInfoRow(
          label: 'Impuestos',
          value: _formatAmount(data.taxes),
          valueStyle: context.textStyles.bodyMedium,
          padded: true,
        ),
        const AppDivider(),
        const SizedBox(height: AppSpacing.space4),
        AppInfoRow(
          label: 'Total',
          value: _formatAmount(data.total),
          labelStyle: context.textStyles.titleMedium,
        ),
      ],
    );
  }
}
