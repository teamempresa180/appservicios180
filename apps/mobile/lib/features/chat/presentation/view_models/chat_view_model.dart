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
  bool _isSending = false;
  String? _sendErrorMessage;

  ChatLoadStatus get status => _status;
  ChatDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  /// Whether a [sendMessage] call is currently in flight — the composer
  /// disables itself while this is `true` so a slow connection can't be
  /// used to fire the same message twice.
  bool get isSending => _isSending;

  /// Reason the most recent [sendMessage] call failed, or `null` if it
  /// hasn't failed. Distinct from [errorMessage] (which is about the
  /// initial [load]) so a failed send never gets mistaken for the whole
  /// screen being in an error state.
  String? get sendErrorMessage => _sendErrorMessage;

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

  /// Sends [content] and, on success, appends the returned `Message` to
  /// the visible conversation immediately (no full reload). Returns
  /// `true` on success, `false` on failure — on failure [errorMessage]
  /// carries the reason the caller can surface (e.g. via a snack bar),
  /// while [status]/[data] are left untouched so the rest of the screen
  /// keeps showing what it already had.
  Future<bool> sendMessage(String content) async {
    final current = _data;
    if (current == null || _isSending) return false;

    _isSending = true;
    _sendErrorMessage = null;
    notifySafely();
    try {
      final message = await _repository.sendMessage(content);
      _data = ChatDisplay(
        chat: current.chat,
        provider: current.provider,
        profile: current.profile,
        order: current.order,
        messages: [...current.messages, message],
        attachments: current.attachments,
        isOnline: current.isOnline,
        lastSeen: current.lastSeen,
        isTyping: current.isTyping,
      );
      return true;
    } on HttpException catch (exception) {
      _sendErrorMessage = exception.message;
      return false;
    } catch (_) {
      _sendErrorMessage = 'No se pudo enviar el mensaje. Intenta de nuevo.';
      return false;
    } finally {
      _isSending = false;
      notifySafely();
    }
  }
}
