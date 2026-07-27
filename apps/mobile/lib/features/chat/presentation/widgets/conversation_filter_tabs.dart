import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_chip.dart';

/// The three tabs the "Mensajes" list can show — see `ChatListPage`
/// for how [ConversationTab] maps to a real filter over the loaded
/// list.
enum ConversationTab { all, unread, unanswered }

extension ConversationTabLabel on ConversationTab {
  String get label {
    switch (this) {
      case ConversationTab.all:
        return 'Todos';
      case ConversationTab.unread:
        return 'No leídos';
      case ConversationTab.unanswered:
        return 'Sin responder';
    }
  }
}

/// Controlled tab selector for the "Mensajes" screen — [selected]/
/// [onChanged] are owned by the caller (`ChatListPage`), which filters
/// the conversation list accordingly.
class ConversationFilterTabs extends StatelessWidget {
  const ConversationFilterTabs({
    super.key,
    required this.selected,
    required this.onChanged,
  });

  final ConversationTab selected;
  final ValueChanged<ConversationTab> onChanged;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (final tab in ConversationTab.values) ...[
            AppChip(
              label: tab.label,
              selected: selected == tab,
              onTap: () => onChanged(tab),
            ),
            const SizedBox(width: AppSpacing.space8),
          ],
        ],
      ),
    );
  }
}
