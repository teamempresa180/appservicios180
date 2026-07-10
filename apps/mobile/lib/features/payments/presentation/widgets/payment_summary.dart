import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/payment_display.dart';

/// Recap of the payment's date and reference/receipt numbers.
/// [PaymentDisplay.paymentDate] is real (`Payment.createdAt`);
/// [PaymentDisplay.paymentReference]/[PaymentDisplay.receiptNumber] are
/// simulated — see the feature README.
class PaymentSummary extends StatelessWidget {
  const PaymentSummary({super.key, required this.data});

  final PaymentDisplay data;

  String _formatDate(DateTime date) {
    final day = date.day.toString().padLeft(2, '0');
    final month = date.month.toString().padLeft(2, '0');
    final hour = date.hour.toString().padLeft(2, '0');
    final minute = date.minute.toString().padLeft(2, '0');
    return '$day/$month/${date.year} · $hour:$minute';
  }

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Resumen'),
          _InfoRow(
            label: 'Fecha',
            value: _formatDate(data.paymentDate),
            context: context,
          ),
          _InfoRow(
            label: 'Referencia',
            value: data.paymentReference,
            context: context,
          ),
          _InfoRow(
            label: 'Recibo',
            value: data.receiptNumber,
            context: context,
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.label,
    required this.value,
    required this.context,
  });

  final String label;
  final String value;
  final BuildContext context;

  @override
  Widget build(BuildContext _) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: context.textStyles.bodyMedium),
          const SizedBox(width: AppSpacing.space8),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              overflow: TextOverflow.ellipsis,
              style: context.textStyles.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }
}
