import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_action_row.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Editar horario"/"Copiar horario"/"Limpiar horario" actions. Purely
/// visual — every button is a documented no-op; it does not edit, copy
/// or clear a real schedule yet (see the feature README).
class AvailabilityActions extends StatelessWidget {
  const AvailabilityActions({
    super.key,
    this.onEdit,
    this.onCopy,
    this.onClear,
  });

  final VoidCallback? onEdit;
  final VoidCallback? onCopy;
  final VoidCallback? onClear;

  @override
  Widget build(BuildContext context) {
    return AppActionRow(
      actions: [
        AppButton(
          label: 'Editar horario',
          onPressed: onEdit ?? () {},
          expand: false,
        ),
        AppButton(
          label: 'Copiar horario',
          onPressed: onCopy ?? () {},
          expand: false,
        ),
        AppButton(
          label: 'Limpiar horario',
          onPressed: onClear ?? () {},
          expand: false,
        ),
      ],
    );
  }
}
