import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_action_row.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Editar"/"Pausar" (or "Reactivar")/"Eliminar" actions for one
/// service — call through to `ProviderServicesRepository` for a real
/// update/pause/delete.
class ServiceActions extends StatelessWidget {
  const ServiceActions({
    super.key,
    this.onEdit,
    this.onPause,
    this.onDelete,
    this.isPaused = false,
  });

  final VoidCallback? onEdit;
  final VoidCallback? onPause;
  final VoidCallback? onDelete;

  /// Whether the service is currently paused (`ServiceStatus.inactive`)
  /// — flips the toggle button's label to "Reactivar" so it never
  /// reads as "Pausar" while tapping it would actually reactivate the
  /// service.
  final bool isPaused;

  @override
  Widget build(BuildContext context) {
    return AppActionRow(
      actions: [
        AppButton(label: 'Editar', onPressed: onEdit ?? () {}, expand: false),
        AppButton(
          label: isPaused ? 'Reactivar' : 'Pausar',
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
