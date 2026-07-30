import '../../../../core/network/http_exceptions.dart';
import '../../../../core/presentation/cancellable_view_model.dart';
import '../../mock/mock_chat_data.dart';
import '../../models/chat_display.dart';
import '../../repositories/chat_repository.dart';

enum ChatLoadStatus { loading, success, error }

/// Owns the async load of [ChatPage]'s data against the real
/// [ChatRepository] (resolved via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildData()` now that every repository method is
/// a `Future`.
///
/// [ChatDisplay.isOnline]/[lastSeen]/[isTyping] stay simulated
/// (`mockChatIsOnline` etc.) — there is still no real-time transport
/// backing presence/typing, on either the Flutter or the backend side.
///
/// Extends [CancellableViewModel] so a response that lands after this
/// view model is disposed (user navigated away from the chat) never
/// calls `notifyListeners()` on an already-disposed `ChangeNotifier` —
/// `ChatRepository` doesn't accept a `CancelToken` yet (unlike
/// `OrdersRepository`), so only the disposed-guard half applies here.
class ChatViewModel extends CancellableViewModel {
  ChatViewModel(this._repository);

  final ChatRepository _repository;

  ChatLoadStatus _status = ChatLoadStatus.loading;
  ChatDisplay? _data;
  String? _errorMessage;

  ChatLoadStatus get status => _status;
  ChatDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = ChatLoadStatus.loading;
    notifySafely();
    try {
      final chat = await _repository.getChat();
      final provider = await _repository.getProvider();
      final profile = await _repository.getProfile();
      final order = await _repository.getOrder();
      final messages = await _repository.getMessages();
      final attachments = await _repository.getAttachments();
      _data = ChatDisplay(
        chat: chat,
        provider: provider,
        profile: profile,
        order: order,
        messages: messages,
        attachments: attachments,
        isOnline: mockChatIsOnline,
        lastSeen: mockChatLastSeen,
        isTyping: mockChatIsTyping,
      );
      _status = ChatLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = ChatLoadStatus.error;
    } catch (_) {
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = ChatLoadStatus.error;
    }
    notifySafely();
  }

  Future<void> retry() => load();
}
