import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Agregar contacto" call to action — opens `ContactFormSheet` and
/// creates a real `Contact` via `ContactManagementRepository`.
class AddContactButton extends StatelessWidget {
  const AddContactButton({super.key, required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(label: 'Agregar contacto', onPressed: onPressed);
  }
}
