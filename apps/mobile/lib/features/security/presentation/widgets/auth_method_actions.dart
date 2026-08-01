import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_action_row.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Activar"/"Desactivar" + "Eliminar" actions for one authentication
/// method. `SecurityPage` wires these to toggle the method's status
/// and to delete it via `SecurityRepository`. The toggle button's
/// label reflects [isActive] — an inactive method's button reads
/// "Activar" (tapping it reactivates), not a label that never changes
/// regardless of the method's current state.
class AuthMethodActions extends StatelessWidget {
  const AuthMethodActions({
    super.key,
    this.isActive = true,
    this.onDisable,
    this.onDelete,
  });

  final bool isActive;
  final VoidCallback? onDisable;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    return AppActionRow(
      actions: [
        AppButton(
          label: isActive ? 'Desactivar' : 'Activar',
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
