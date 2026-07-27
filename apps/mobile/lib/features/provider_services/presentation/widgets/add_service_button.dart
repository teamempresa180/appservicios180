import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Nuevo servicio" call to action — opens `ServiceFormSheet` and
/// creates a real `Service` via `ProviderServicesRepository`.
class AddServiceButton extends StatelessWidget {
  const AddServiceButton({super.key, required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(label: 'Nuevo servicio', onPressed: onPressed);
  }
}
