import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Agregar dirección" call to action — opens `AddressFormSheet` and
/// creates a real `Address` via `AddressManagementRepository`.
class AddAddressButton extends StatelessWidget {
  const AddAddressButton({super.key, required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(label: 'Agregar dirección', onPressed: onPressed);
  }
}
