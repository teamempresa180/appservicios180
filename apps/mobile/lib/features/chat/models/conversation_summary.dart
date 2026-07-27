import '../../../chat/models/chat_id.dart';

/// One row of the "Mensajes" conversation list — everything
/// `ConversationTile` needs without the caller having to separately
/// fetch the Chat/Message/Provider/Profile graph for every item. Not a
/// domain entity: a display-only summary built by [ChatRepository]
/// from those entities (see `getConversations()`).
class ConversationSummary {
  const ConversationSummary({
    required this.chatId,
    required this.counterpartName,
    required this.lastMessagePreview,
    required this.lastMessageAt,
    required this.unreadCount,
    required this.isUnanswered,
  });

  final ChatId chatId;

  /// Display name of the other party in the conversation (the provider,
  /// from the client's point of view, or vice versa).
  final String counterpartName;

  final String lastMessagePreview;
  final DateTime lastMessageAt;

  /// How many messages from the counterpart the viewer hasn't read yet.
  final int unreadCount;

  /// `true` when the most recent message was sent by the counterpart
  /// and the viewer hasn't replied since — surfaced by the "Sin
  /// responder" filter.
  final bool isUnanswered;
}
