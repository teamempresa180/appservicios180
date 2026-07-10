import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Guardar disponibilidad" call to action. Purely visual —
/// [onPressed] is a no-op by default; it does not persist any real
/// schedule yet (see the feature README).
class SaveAvailabilityButton extends StatelessWidget {
  const SaveAvailabilityButton({super.key, this.onPressed});

  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(
      label: 'Guardar disponibilidad',
      onPressed: onPressed ?? () {},
    );
  }
}
