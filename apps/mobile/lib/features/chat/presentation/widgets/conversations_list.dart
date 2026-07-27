import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/conversation_summary.dart';
import 'conversation_tile.dart';

/// Vertical list of `ConversationTile`s, entering with a staggered
/// fade+slide (see `staggerDelayFor`) — same entrance pattern as
/// `OrdersList`.
class ConversationsList extends StatelessWidget {
  const ConversationsList({
    super.key,
    required this.conversations,
    required this.onTap,
  });

  final List<ConversationSummary> conversations;
  final ValueChanged<ConversationSummary> onTap;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final (index, conversation) in conversations.indexed) ...[
          FadeIn(
            delay: staggerDelayFor(index),
            child: SlideIn(
              child: ConversationTile(
                conversation: conversation,
                onTap: () => onTap(conversation),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space12),
        ],
      ],
    );
  }
}
