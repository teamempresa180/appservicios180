import '../../../../core/network/http_exceptions.dart';
import '../../../../core/presentation/cancellable_view_model.dart';
import '../../models/conversation_summary.dart';
import '../../repositories/chat_repository.dart';

enum ChatListLoadStatus { loading, success, error }

/// Owns the async load of [ChatListPage]'s conversation list against
/// the real [ChatRepository] (resolved via DI, see
/// `core/di/service_locator.dart`) — same Loading/Success/Error
/// pattern as `OrdersViewModel`.
///
/// Extends [CancellableViewModel] purely for the disposed-guard half
/// (`notifySafely`) — `ChatRepository.getConversations` doesn't accept
/// a `CancelToken` yet (unlike `OrdersRepository`).
class ChatListViewModel extends CancellableViewModel {
  ChatListViewModel(this._repository);

  final ChatRepository _repository;

  ChatListLoadStatus _status = ChatListLoadStatus.loading;
  List<ConversationSummary> _conversations = const [];
  String? _errorMessage;

  ChatListLoadStatus get status => _status;
  List<ConversationSummary> get conversations => _conversations;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = ChatListLoadStatus.loading;
    notifySafely();
    try {
      _conversations = await _repository.getConversations();
      _status = ChatListLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = ChatListLoadStatus.error;
    } catch (_) {
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = ChatListLoadStatus.error;
    }
    notifySafely();
  }

  Future<void> retry() => load();
}
