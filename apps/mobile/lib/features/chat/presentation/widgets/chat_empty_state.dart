import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Chat screen. Reuses `AppEmptyState`
/// — no new Core UI widget.
class ChatEmptyState extends StatelessWidget {
  const ChatEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppEmptyState(
      title: 'Sin mensajes todavía',
      description: 'Cuando el proveedor o tú escriban, la conversación '
          'aparecerá aquí.',
      icon: Icons.chat_bubble_outline,
    );
  }
}
