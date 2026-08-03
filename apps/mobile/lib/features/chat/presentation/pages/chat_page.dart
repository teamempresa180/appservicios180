import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../repositories/chat_repository.dart';
import '../view_models/chat_view_model.dart';
import '../widgets/chat_actions.dart';
import '../widgets/chat_empty_state.dart';
import '../widgets/chat_header.dart';
import '../widgets/chat_loading.dart';
import '../widgets/chat_messages.dart';
import '../widgets/message_input.dart';
import '../widgets/provider_header.dart';
import '../widgets/typing_indicator.dart';

/// Chat screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow, the same way every other
/// feature so far does. Loads from the real backend via
/// [ChatViewModel] (resolved from the service locator — see
/// `core/di/service_locator.dart`).
///
/// Shows a single, fixed conversation (no id-based lookup yet) — see
/// the feature README.
class ChatPage extends StatefulWidget {
  const ChatPage({super.key, ChatRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ChatRepository? _repository;

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  late final ChatViewModel _viewModel = ChatViewModel(
    widget._repository ?? locator<ChatRepository>(),
  );

  @override
  void initState() {
    super.initState();
    _viewModel.load();
    _viewModel.addListener(_onViewModelChanged);
  }

  final _scrollController = ScrollController();
  int _lastMessageCount = 0;

  void _onViewModelChanged() {
    setState(() {});
    // A conversation with any history opened scrolled to the *oldest*
    // message, and a message the user had just sent landed below the
    // fold — so the composer appeared to do nothing. Jump to the newest
    // message whenever the message count grows (initial load included).
    final count = _viewModel.data?.messages.length ?? 0;
    if (count > _lastMessageCount) {
      _lastMessageCount = count;
      _scrollToBottom();
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !_scrollController.hasClients) return;
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOut,
      );
    });
  }

  @override
  void dispose() {
    _viewModel.removeListener(_onViewModelChanged);
    _viewModel.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Widget _buildBody() {
    switch (_viewModel.status) {
      case ChatLoadStatus.loading:
        return const ChatLoading();
      case ChatLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudo cargar la conversación',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case ChatLoadStatus.success:
        final data = _viewModel.data!;
        // A brand-new conversation (e.g. right after a Quote was just
        // accepted) has zero messages — it must still show the header
        // and, critically, the composer, so the client/provider can
        // send the *first* message. Previously this returned only
        // `ChatEmptyState` and hid `MessageInput` entirely, a dead end
        // with no way to start the conversation.
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            FadeIn(child: ChatHeader(data: data)),
            const SizedBox(height: AppSpacing.space16),
            Row(
              children: [
                Expanded(child: ProviderHeader(data: data)),
                const ChatActions(),
              ],
            ),
            const SizedBox(height: AppSpacing.space16),
            if (data.messages.isEmpty)
              const ChatEmptyState()
            else
              SlideIn(child: ChatMessages(data: data)),
            if (data.isTyping) ...[
              const SizedBox(height: AppSpacing.space8),
              const TypingIndicator(),
            ],
            const SizedBox(height: AppSpacing.space16),
            MessageInput(
              onSend: _viewModel.sendMessage,
              failureMessage: () => _viewModel.sendErrorMessage,
            ),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      controller: _scrollController,
      child: _buildBody(),
    );
  }
}
