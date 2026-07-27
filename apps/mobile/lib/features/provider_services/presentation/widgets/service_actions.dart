import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_action_row.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Editar"/"Pausar"/"Eliminar" actions for one service — call through
/// to `ProviderServicesRepository` for a real update/pause/delete.
class ServiceActions extends StatelessWidget {
  const ServiceActions({super.key, this.onEdit, this.onPause, this.onDelete});

  final VoidCallback? onEdit;
  final VoidCallback? onPause;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    return AppActionRow(
      actions: [
        AppButton(label: 'Editar', onPressed: onEdit ?? () {}, expand: false),
        AppButton(label: 'Pausar', onPressed: onPause ?? () {}, expand: false),
        AppButton(
          label: 'Eliminar',
          onPressed: onDelete ?? () {},
          expand: false,
        ),
      ],
    );
  }
}
