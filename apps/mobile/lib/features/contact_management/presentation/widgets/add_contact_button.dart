import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Agregar contacto" call to action. Purely visual — [onPressed] is a
/// no-op by default; it does not create a real `Contact` yet (see the
/// feature README).
class AddContactButton extends StatelessWidget {
  const AddContactButton({super.key, this.onPressed});

  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(label: 'Agregar contacto', onPressed: onPressed ?? () {});
  }
}
