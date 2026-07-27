import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Agregar método" call to action. `SecurityPage` wires [onPressed]
/// to open `AuthMethodTypeSheet` and create a real `Authentication`
/// method via `SecurityRepository.createAuthMethod`.
class AddAuthMethodButton extends StatelessWidget {
  const AddAuthMethodButton({super.key, this.onPressed});

  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(label: 'Agregar método', onPressed: onPressed ?? () {});
  }
}
