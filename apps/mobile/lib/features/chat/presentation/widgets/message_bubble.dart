import 'package:flutter/material.dart';
import '../../../../attachment/entities/attachment.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../message/entities/message.dart';
import 'attachment_preview.dart';

/// A single message bubble, aligned right for the provider and left
/// for the client (or vice versa, via [isFromProvider]). **No color is
/// stored in any model** — every color here comes straight from
/// `context.colors.*` (the app's neutral `ColorScheme`), resolved at
/// build time, per the project's rule that only the Design System
/// picks colors.
///
/// [attachments] (added in a later prompt as a **planned extension** —
/// see the feature README) renders every real `Attachment` for this
/// message via `AttachmentPreview`, below the content and above the
/// timestamp. Empty by default — most messages have none.
class MessageBubble extends StatelessWidget {
  const MessageBubble({
    super.key,
    required this.message,
    required this.isFromProvider,
    this.attachments = const [],
  });

  final Message message;
  final bool isFromProvider;
  final List<Attachment> attachments;

  String _formatTime(DateTime time) {
    final hour = time.hour.toString().padLeft(2, '0');
    final minute = time.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  @override
  Widget build(BuildContext context) {
    final bubbleColor = isFromProvider
        ? context.colors.surfaceContainerHighest
        : context.colors.primary;
    final textColor = isFromProvider
        ? context.colors.onSurface
        : context.colors.onPrimary;

    return Align(
      alignment: isFromProvider ? Alignment.centerLeft : Alignment.centerRight,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: AppSpacing.space4),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.space12,
          vertical: AppSpacing.space8,
        ),
        constraints: const BoxConstraints(maxWidth: 280),
        decoration: BoxDecoration(
          color: bubbleColor,
          borderRadius: BorderRadius.circular(AppRadius.radius12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              message.content,
              style: context.textStyles.bodyMedium?.copyWith(color: textColor),
            ),
            for (final attachment in attachments)
              AttachmentPreview(
                attachment: attachment,
                onSurfaceColor: textColor,
              ),
            const SizedBox(height: AppSpacing.space4),
            Text(
              _formatTime(message.sentAt),
              style: context.textStyles.bodySmall?.copyWith(
                color: textColor.withValues(alpha: 0.7),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
