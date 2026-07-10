import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Editar"/"Pausar"/"Eliminar" actions for one service. Purely visual
/// — every button is a documented no-op; it does not edit, pause or
/// delete a real service yet (see the feature README).
class ServiceActions extends StatelessWidget {
  const ServiceActions({
    super.key,
    this.onEdit,
    this.onPause,
    this.onDelete,
  });

  final VoidCallback? onEdit;
  final VoidCallback? onPause;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: AppSpacing.space8,
      runSpacing: AppSpacing.space8,
      children: [
        AppButton(label: 'Editar', onPressed: onEdit ?? () {}, expand: false),
        AppButton(
          label: 'Pausar',
          onPressed: onPause ?? () {},
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
