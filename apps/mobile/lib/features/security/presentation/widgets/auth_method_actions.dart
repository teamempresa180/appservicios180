import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Desactivar"/"Eliminar" actions for one authentication method.
/// Purely visual — every button is a documented no-op; it does not
/// disable or remove a real `Authentication` method yet (see the
/// feature README).
class AuthMethodActions extends StatelessWidget {
  const AuthMethodActions({super.key, this.onDisable, this.onDelete});

  final VoidCallback? onDisable;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: AppSpacing.space8,
      runSpacing: AppSpacing.space8,
      children: [
        AppButton(
          label: 'Desactivar',
          onPressed: onDisable ?? () {},
          expand: false,
        ),
        AppButton(
          label: 'Eliminar',
          onPressed: onDelete ?? () {},
          expand: false,
        ),
      ],
    );
  }
}
