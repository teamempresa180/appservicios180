import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_divider.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/quote_data.dart';

/// Cost breakdown: subtotal (real, `Quote.proposedPrice`), travel fee,
/// discount and taxes (simulated), and total (derived). See `QuoteData`
/// and the feature README for what is real/simulated/derived.
class PriceBreakdown extends StatelessWidget {
  const PriceBreakdown({super.key, required this.data});

  final QuoteData data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Desglose de costos'),
          _PriceRow(label: 'Subtotal', amount: data.subtotal, context: context),
          _PriceRow(
            label: 'Desplazamiento',
            amount: data.travelFee,
            context: context,
          ),
          _PriceRow(
            label: 'Descuento',
            amount: -data.discount,
            context: context,
          ),
          _PriceRow(label: 'Impuestos', amount: data.taxes, context: context),
          const AppDivider(),
          const SizedBox(height: AppSpacing.space4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Total', style: context.textStyles.titleMedium),
              Text(
                '\$${data.total.toStringAsFixed(2)}',
                style: context.textStyles.titleMedium,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _PriceRow extends StatelessWidget {
  const _PriceRow({
    required this.label,
    required this.amount,
    required this.context,
  });

  final String label;
  final num amount;
  final BuildContext context;

  String get _formattedAmount {
    return amount < 0
        ? '-\$${(-amount).toStringAsFixed(2)}'
        : '\$${amount.toStringAsFixed(2)}';
  }

  @override
  Widget build(BuildContext _) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: context.textStyles.bodyMedium),
          Text(_formattedAmount, style: context.textStyles.bodyMedium),
        ],
      ),
    );
  }
}
