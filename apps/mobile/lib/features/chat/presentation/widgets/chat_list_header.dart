import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// "Mensajes" screen title. No new Core UI widget — reuses
/// `AppSectionTitle` (same pattern as `OrdersHeader`).
class ChatListHeader extends StatelessWidget {
  const ChatListHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppSectionTitle(
      title: 'Mensajes',
      subtitle: 'Tus conversaciones con clientes y proveedores',
    );
  }
}
