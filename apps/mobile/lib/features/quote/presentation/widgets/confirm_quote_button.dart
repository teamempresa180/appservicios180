import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../orders/presentation/pages/orders_page.dart';

/// "Confirmar solicitud" call to action. Opens the (visual-only, fixed
/// mock) Orders screen — the only change authorized in the Orders
/// prompt. Purely visual — it does not create a real `Order` from this
/// `Quote` yet (see the feature README).
class ConfirmQuoteButton extends StatelessWidget {
  const ConfirmQuoteButton({super.key, this.onPressed});

  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(
      label: 'Confirmar solicitud',
      onPressed:
          onPressed ??
          () => Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (context) => Scaffold(
                appBar: AppBar(title: const Text('Mis órdenes')),
                body: const SafeArea(child: OrdersPage()),
              ),
            ),
          ),
    );
  }
}
