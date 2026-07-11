import '../../../attachment/entities/attachment.dart';
import '../../../chat/entities/chat.dart';
import '../../../message/entities/message.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';

/// Local (on-device) source for the domain entities the Chat screen
/// needs. No implementation — see `PROJECT_STATUS.md` (Sprint 2,
/// Etapa 6).
abstract class ChatLocalDataSource {
  Chat getChat();
  Provider getProvider();
  Profile getProfile();
  Order getOrder();
  List<Message> getMessages();
  List<Attachment> getAttachments();
}
