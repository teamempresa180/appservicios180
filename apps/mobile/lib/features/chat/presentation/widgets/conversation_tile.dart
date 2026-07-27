import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../../core/ui/widgets/app_badge.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../models/conversation_summary.dart';

/// One row of the "Mensajes" list. Bold preview text and an unread
/// count [AppBadge] when [ConversationSummary.unreadCount] is above
/// zero; a small "Sin responder" [AppBadge] when the counterpart wrote
/// last and the viewer hasn't replied.
class ConversationTile extends StatelessWidget {
  const ConversationTile({
    super.key,
    required this.conversation,
    required this.onTap,
  });

  final ConversationSummary conversation;
  final VoidCallback onTap;

  String _initialsFor(String name) {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty || parts.first.isEmpty) return '?';
    final first = parts.first[0];
    final last = parts.length > 1 && parts.last.isNotEmpty
        ? parts.last[0]
        : '';
    return '$first$last'.toUpperCase();
  }

  String _timeLabel(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);
    if (difference.inDays >= 1) return '${difference.inDays} d';
    if (difference.inHours >= 1) return '${difference.inHours} h';
    if (difference.inMinutes >= 1) return '${difference.inMinutes} min';
    return 'Ahora';
  }

  @override
  Widget build(BuildContext context) {
    final hasUnread = conversation.unreadCount > 0;

    return AppCard(
      onTap: onTap,
      child: Row(
        children: [
          AppAvatar(
            initials: _initialsFor(conversation.counterpartName),
            radius: AppSpacing.space20,
          ),
          const SizedBox(width: AppSpacing.space12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        conversation.counterpartName,
                        style: context.textStyles.titleSmall,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Text(
                      _timeLabel(conversation.lastMessageAt),
                      style: context.textStyles.bodySmall,
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.space4),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        conversation.lastMessagePreview,
                        style: hasUnread
                            ? context.textStyles.bodyMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                              )
                            : context.textStyles.bodyMedium,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (hasUnread) ...[
                      const SizedBox(width: AppSpacing.space8),
                      AppBadge(
                        label: '${conversation.unreadCount}',
                        tone: AppBadgeTone.error,
                      ),
                    ] else if (conversation.isUnanswered) ...[
                      const SizedBox(width: AppSpacing.space8),
                      const AppBadge(
                        label: 'Sin responder',
                        tone: AppBadgeTone.warning,
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
