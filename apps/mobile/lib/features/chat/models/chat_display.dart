import '../../../chat/entities/chat.dart';
import '../../../message/entities/message.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';

/// Presentation-only composition of everything a Chat screen needs.
/// Composes five real domain entities — [chat], [provider], [profile],
/// [order], [messages] — plus three fields with no domain equivalent
/// yet:
///
/// - [isOnline], [lastSeen]: **fully simulated** — `Chat`/`Message` are
///   pure records with "no real-time transport" per their own class
///   docs; no presence module exists.
/// - [isTyping]: **fully simulated** — same reason, no real-time
///   transport to report a live typing state.
///
/// Nothing here is added to the domain entities themselves. No `Color`
/// is stored anywhere in this model — see `message_bubble.dart` for how
/// sender/receiver colors are resolved purely from `context.colors.*`.
class ChatDisplay {
  const ChatDisplay({
    required this.chat,
    required this.provider,
    required this.profile,
    required this.order,
    required this.messages,
    required this.isOnline,
    required this.lastSeen,
    required this.isTyping,
  });

  final Chat chat;
  final Provider provider;
  final Profile profile;
  final Order order;
  final List<Message> messages;

  /// Simulated — see the class doc.
  final bool isOnline;

  /// Simulated — see the class doc.
  final String lastSeen;

  /// Simulated — see the class doc.
  final bool isTyping;

  String get providerName => profile.displayName;

  /// Real domain data — a message was sent by the provider when its
  /// `senderIdentityId` matches `Provider.identityId`. No simulated
  /// "isProvider" flag needed on `Message` — the domain already lets
  /// us derive this.
  bool isFromProvider(Message message) =>
      message.senderIdentityId == provider.identityId;
}
