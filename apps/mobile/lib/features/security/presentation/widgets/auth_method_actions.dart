import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_action_row.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Desactivar"/"Eliminar" actions for one authentication method.
/// `SecurityPage` wires these to toggle the method's status and to
/// delete it via `SecurityRepository`.
class AuthMethodActions extends StatelessWidget {
  const AuthMethodActions({super.key, this.onDisable, this.onDelete});

  final VoidCallback? onDisable;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    return AppActionRow(
      actions: [
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
