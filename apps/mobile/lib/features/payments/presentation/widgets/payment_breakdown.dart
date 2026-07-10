import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/payment_display.dart';

/// The payment's total. Real domain data (`Payment.amount`) — see
/// `PaymentDisplay` and the feature README. Unlike `Quote`, `Payment`
/// models a single amount with no subtotal/fee/tax line items, so
/// there is nothing else to break down here.
class PaymentBreakdown extends StatelessWidget {
  const PaymentBreakdown({super.key, required this.data});

  final PaymentDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Total'),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Total pagado', style: context.textStyles.bodyMedium),
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
