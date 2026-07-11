import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_info_row.dart';
import '../../../../core/ui/widgets/app_section.dart';
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
    return AppSection(
      title: 'Total',
      children: [
        AppInfoRow(
          label: 'Total pagado',
          value: '\$${data.total.toStringAsFixed(2)}',
        ),
      ],
    );
  }
}
