import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Editar"/"Eliminar"/"Seleccionar" actions for one address. Purely
/// visual — every button is a documented no-op; it does not edit,
/// delete or select a real address yet (see the feature README).
class AddressActions extends StatelessWidget {
  const AddressActions({
    super.key,
    this.onEdit,
    this.onDelete,
    this.onSelect,
  });

  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final VoidCallback? onSelect;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: AppSpacing.space8,
      runSpacing: AppSpacing.space8,
      children: [
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
