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

  void _onViewModelChanged() => setState(() {});

  @override
  void dispose() {
    _viewModel.removeListener(_onViewModelChanged);
    _viewModel.dispose();
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
        if (data.messages.isEmpty) return const ChatEmptyState();
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
            SlideIn(child: ChatMessages(data: data)),
            if (data.isTyping) ...[
              const SizedBox(height: AppSpacing.space8),
              const TypingIndicator(),
            ],
            const SizedBox(height: AppSpacing.space16),
            const MessageInput(),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(child: _buildBody());
  }
}
