import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Notifications title. No new Core UI widget — reuses
/// `AppSectionTitle`.
class NotificationsHeader extends StatelessWidget {
  const NotificationsHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppSectionTitle(
      title: 'Notificaciones',
      subtitle: 'Novedades sobre tus órdenes, pagos y mensajes',
    );
  }
}
