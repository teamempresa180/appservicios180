import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_action_row.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Editar"/"Eliminar" actions for one contact — call through to
/// `ContactManagementRepository` for a real update/delete.
class ContactActions extends StatelessWidget {
  const ContactActions({super.key, this.onEdit, this.onDelete});

  final VoidCallback? onEdit;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    return AppActionRow(
      actions: [
        AppButton(label: 'Editar', onPressed: onEdit ?? () {}, expand: false),
        AppButton(
          label: 'Eliminar',
          onPressed: onDelete ?? () {},
          expand: false,
        ),
      ],
    );
  }
}
