import '../../../attachment/entities/attachment.dart';
import '../../../chat/entities/chat.dart';
import '../../../message/entities/message.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';

/// Remote (API/Firebase) source for the domain entities the Chat
/// screen needs — real-time messaging would eventually live behind
/// this same seam (e.g. a WebSocket-backed implementation). No
/// implementation — see `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class ChatRemoteDataSource {
  Future<Chat> getChat();
  Future<Provider> getProvider();
  Future<Profile> getProfile();
  Future<Order> getOrder();
  Future<List<Message>> getMessages();
  Future<List<Attachment>> getAttachments();
}
