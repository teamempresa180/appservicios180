import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Agregar dirección" call to action. Purely visual — [onPressed] is
/// a no-op by default; it does not create a real `Address` yet (see
/// the feature README).
class AddAddressButton extends StatelessWidget {
  const AddAddressButton({super.key, this.onPressed});

  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(
      label: 'Agregar dirección',
      onPressed: onPressed ?? () {},
    );
  }
}
