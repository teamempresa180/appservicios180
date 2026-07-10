import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Notifications screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class NotificationsEmptyState extends StatelessWidget {
  const NotificationsEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin notificaciones',
      description: 'Cuando haya novedades sobre tus órdenes, pagos o '
          'mensajes, aparecerán aquí.',
      icon: Icons.notifications_none_outlined,
    );
  }
}
