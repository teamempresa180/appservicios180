import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/chat_display.dart';
import 'message_bubble.dart';

/// Vertical list of `MessageBubble`s for the conversation. Purely
/// visual — no scrolling-to-bottom logic beyond what
/// `SingleChildScrollView` gives for free in `ChatPage`.
class ChatMessages extends StatelessWidget {
  const ChatMessages({super.key, required this.data});

  final ChatDisplay data;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final message in data.messages) ...[
          MessageBubble(
            message: message,
            isFromProvider: data.isFromProvider(message),
            attachments: data.attachmentsFor(message),
          ),
          const SizedBox(height: AppSpacing.space4),
        ],
      ],
    );
  }
}
