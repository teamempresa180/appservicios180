import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Continuar" call to action. `RequestServicePage` wires [onPressed]
/// to submit the request as a real `Order` via
/// `RequestServiceRepository.createOrder`.
class ContinueButton extends StatelessWidget {
  const ContinueButton({
    super.key,
    required this.onPressed,
    this.isLoading = false,
  });

  final VoidCallback onPressed;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    return AppButton(
      label: 'Continuar',
      onPressed: onPressed,
      isLoading: isLoading,
    );
  }
}
