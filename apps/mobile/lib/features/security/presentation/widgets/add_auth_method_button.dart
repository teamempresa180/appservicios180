import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Agregar método" call to action. Purely visual — [onPressed] is a
/// no-op by default; it does not create a real `Authentication` method
/// yet (see the feature README).
class AddAuthMethodButton extends StatelessWidget {
  const AddAuthMethodButton({super.key, this.onPressed});

  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(label: 'Agregar método', onPressed: onPressed ?? () {});
  }
}
