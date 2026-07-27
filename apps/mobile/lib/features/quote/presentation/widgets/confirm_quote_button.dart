import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Confirmar solicitud" call to action. `QuotePage` wires [onPressed]
/// to accept the real `Quote` via `QuoteRepository.acceptQuote`.
class ConfirmQuoteButton extends StatelessWidget {
  const ConfirmQuoteButton({super.key, required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(label: 'Confirmar solicitud', onPressed: onPressed);
  }
}
