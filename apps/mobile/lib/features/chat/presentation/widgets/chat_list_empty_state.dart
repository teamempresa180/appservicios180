import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Empty state for the "Mensajes" screen. Reuses `AppEmptyState` — no
/// new Core UI widget. [title]/[description] are overridable so a
/// filter tab that happens to be empty while the user *does* have
/// conversations can say so, rather than claiming they have none.
class ChatListEmptyState extends StatelessWidget {
  const ChatListEmptyState({super.key, this.title, this.description});

  final String? title;
  final String? description;

  @override
  Widget build(BuildContext context) {
    return AppEmptyState(
      title: title ?? 'Sin conversaciones todavía',
      description:
          description ??
          'Cuando tengas una orden en curso, podrás chatear aquí con '
          'el cliente o el proveedor.',
      icon: Icons.chat_bubble_outline,
    );
  }
}
