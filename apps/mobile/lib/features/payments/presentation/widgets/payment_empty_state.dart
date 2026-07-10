import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Payments screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class PaymentEmptyState extends StatelessWidget {
  const PaymentEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin información de pago',
      description: 'Todavía no hay un pago asociado a esta orden.',
      icon: Icons.payment_outlined,
    );
  }
}
