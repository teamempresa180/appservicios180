import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../payment/models/payment_method.dart';
import '../../models/payment_display.dart';

/// The payment's method. Real domain data (`Payment.method`) — see
/// `PaymentDisplay` and the feature README.
class PaymentMethodCard extends StatelessWidget {
  const PaymentMethodCard({super.key, required this.data});

  final PaymentDisplay data;

  IconData _iconFor(PaymentMethod method) {
    switch (method) {
      case PaymentMethod.card:
        return Icons.credit_card_outlined;
      case PaymentMethod.bankTransfer:
        return Icons.account_balance_outlined;
      case PaymentMethod.cash:
        return Icons.payments_outlined;
      case PaymentMethod.digitalWallet:
        return Icons.account_balance_wallet_outlined;
      case PaymentMethod.other:
        return Icons.more_horiz;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Método de pago'),
          Row(
            children: [
              Icon(
                _iconFor(data.paymentMethod),
                color: context.colors.primary,
              ),
              const SizedBox(width: AppSpacing.space8),
              Text(
                data.paymentMethod.label,
                style: context.textStyles.bodyMedium,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
