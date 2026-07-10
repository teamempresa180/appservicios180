import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Enviar verificación" call to action. Purely visual — [onPressed]
/// is a no-op by default; it does not submit any real verification
/// request yet (see the feature README).
class SubmitVerificationButton extends StatelessWidget {
  const SubmitVerificationButton({super.key, this.onPressed});

  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(
      label: 'Enviar verificación',
      onPressed: onPressed ?? () {},
    );
  }
}
