import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../mock/mock_chat_data.dart';
import '../../models/chat_display.dart';
import '../../repositories/mock_chat_repository.dart';
import '../widgets/chat_actions.dart';
import '../widgets/chat_empty_state.dart';
import '../widgets/chat_header.dart';
import '../widgets/chat_loading.dart';
import '../widgets/chat_messages.dart';
import '../widgets/message_input.dart';
import '../widgets/provider_header.dart';
import '../widgets/typing_indicator.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as `OrdersPage`/`PaymentsPage`, no real async
/// fetch, no state management.
enum ChatViewState { loading, empty, conversation }

/// Chat screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow, the same way every other
/// feature so far does. Completely independent: its own repository,
/// its own mock data.
///
/// Shows a single, fixed conversation (no id-based lookup yet) — see
/// the feature README.
class ChatPage extends StatelessWidget {
  const ChatPage({super.key, this.state = ChatViewState.conversation});

  final ChatViewState state;

  ChatDisplay _buildData() {
    final repository = MockChatRepository();

    return ChatDisplay(
      chat: repository.getChat(),
      provider: repository.getProvider(),
      profile: repository.getProfile(),
      order: repository.getOrder(),
      messages: repository.getMessages(),
      isOnline: mockChatIsOnline,
      lastSeen: mockChatLastSeen,
      isTyping: mockChatIsTyping,
    );
  }

  Widget _buildBody() {
    switch (state) {
      case ChatViewState.loading:
        return const ChatLoading();
      case ChatViewState.empty:
        return const ChatEmptyState();
      case ChatViewState.conversation:
        final data = _buildData();
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
