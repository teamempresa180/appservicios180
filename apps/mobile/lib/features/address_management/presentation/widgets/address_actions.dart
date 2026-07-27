import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_action_row.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Editar"/"Eliminar"/"Seleccionar" actions for one address. "Editar"
/// and "Eliminar" call through to `AddressManagementRepository` for a
/// real update/delete — "Seleccionar" (marking an address as the
/// default delivery address) has no domain field to persist yet, so it
/// stays a no-op by default.
class AddressActions extends StatelessWidget {
  const AddressActions({super.key, this.onEdit, this.onDelete, this.onSelect});

  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final VoidCallback? onSelect;

  @override
  Widget build(BuildContext context) {
    return AppActionRow(
      actions: [
        AppButton(
          label: 'Seleccionar',
          onPressed: onSelect ?? () {},
          expand: false,
        ),
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
