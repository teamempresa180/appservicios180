import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';
import '../../../../payment/models/payment_status.dart';
import '../../../chat/presentation/pages/chat_page.dart';
import '../../models/payment_display.dart';

/// The payment's main action button — its label depends on
/// `Payment.status`. Purely visual, **except** for `completed`
/// ("Ver recibo"), which opens the (visual-only, fixed mock) Chat
/// screen — the only change authorized in the Chat prompt. Viewing a
/// receipt is where a client would naturally reach out to the provider
/// about it; no other status navigates anywhere yet (see the feature
/// README). The other statuses ("Pagar"/"Intentar nuevamente"/"Ver
/// información") still don't have a real payment gateway/backend
/// behind them, but give a visible snackbar instead of silently doing
/// nothing on tap — same pattern `MessageInput` uses for its no-op
/// "Enviar" button.
///
/// `Payment.status` (the real domain enum) has no "processing" value —
/// only `pending`/`completed`/`failed`/`cancelled`. The prompt asked
/// for a "Procesando" → "Ver estado" case, which has no real mock
/// payment to represent it; `cancelled` (not mentioned by the prompt)
/// reuses the "Ver información" label from `OrderActions` for the same
/// reason. See the feature README.
class PaymentActions extends StatelessWidget {
  const PaymentActions({super.key, required this.data, this.onPressed});

  final PaymentDisplay data;
  final VoidCallback? onPressed;

  String get _label {
    switch (data.payment.status) {
      case PaymentStatus.pending:
        return 'Pagar';
      case PaymentStatus.completed:
        return 'Ver recibo';
      case PaymentStatus.failed:
        return 'Intentar nuevamente';
      case PaymentStatus.cancelled:
        return 'Ver información';
    }
  }

  void _openChat(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Chat')),
          body: const SafeArea(child: ChatPage()),
        ),
      ),
    );
  }

  void _showNotYetAvailable(BuildContext context) {
    AppSnackBar.show(
      context,
      'Esta función estará disponible próximamente',
      type: AppSnackBarType.info,
    );
  }

  @override
  Widget build(BuildContext context) {
    final isCompleted = data.payment.status == PaymentStatus.completed;

    return AppButton(
      label: _label,
      onPressed:
          onPressed ??
          (isCompleted
              ? () => _openChat(context)
              : () => _showNotYetAvailable(context)),
    );
  }
}
