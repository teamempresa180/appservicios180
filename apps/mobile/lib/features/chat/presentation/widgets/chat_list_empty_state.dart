import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the "Mensajes" screen. Reuses
/// `AppEmptyState` — no new Core UI widget.
class ChatListEmptyState extends StatelessWidget {
  const ChatListEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin conversaciones todavía',
      description:
          'Cuando tengas una orden en curso, podrás chatear aquí con '
          'el cliente o el proveedor.',
      icon: Icons.chat_bubble_outline,
    );
  }
}
