import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/payment_display.dart';

/// Payments title + subtitle (service name). Reuses `AppSectionTitle`'s
/// subtitle support — no new Core UI widget.
class PaymentsHeader extends StatelessWidget {
  const PaymentsHeader({super.key, required this.data});

  final PaymentDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppSectionTitle(title: 'Pago', subtitle: data.service.name);
  }
}
