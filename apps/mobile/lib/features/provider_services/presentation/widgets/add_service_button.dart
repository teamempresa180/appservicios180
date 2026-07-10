import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Nuevo servicio" call to action. Purely visual — [onPressed] is a
/// no-op by default; it does not create a real `Service` yet (see the
/// feature README).
class AddServiceButton extends StatelessWidget {
  const AddServiceButton({super.key, this.onPressed});

  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(label: 'Nuevo servicio', onPressed: onPressed ?? () {});
  }
}
