import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../models/conversation_summary.dart';
import '../../repositories/chat_repository.dart';
import '../view_models/chat_list_view_model.dart';
import '../widgets/chat_list_empty_state.dart';
import '../widgets/chat_list_header.dart';
import '../widgets/chat_list_loading.dart';
import '../widgets/conversation_filter_tabs.dart';
import '../widgets/conversations_list.dart';
import 'chat_page.dart';

/// "Mensajes" screen — a real conversation list (unread counts,
/// "Sin responder" state) instead of jumping straight into a single
/// chat. Does NOT build its own `Scaffold`, same as every other App
/// Shell destination. Tapping a conversation pushes [ChatPage]; that
/// page still shows the one fixed conversation the backend supports
/// today (no id-based lookup yet — see `ChatRepository`'s doc
/// comment), so which row was tapped doesn't change what opens.
class ChatListPage extends StatefulWidget {
  const ChatListPage({super.key, ChatRepository? repository})
    : _repository = repository;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final ChatRepository? _repository;

  @override
  State<ChatListPage> createState() => _ChatListPageState();
}

class _ChatListPageState extends State<ChatListPage> {
  late final ChatListViewModel _viewModel = ChatListViewModel(
    widget._repository ?? locator<ChatRepository>(),
  );

  ConversationTab _selectedTab = ConversationTab.all;

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

  List<ConversationSummary> get _filteredConversations {
    switch (_selectedTab) {
      case ConversationTab.all:
        return _viewModel.conversations;
      case ConversationTab.unread:
        return _viewModel.conversations
            .where((conversation) => conversation.unreadCount > 0)
            .toList();
      case ConversationTab.unanswered:
        return _viewModel.conversations
            .where((conversation) => conversation.isUnanswered)
            .toList();
    }
  }

  void _openConversation(ConversationSummary conversation) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: Text(conversation.counterpartName)),
          body: SafeArea(child: ChatPage(repository: widget._repository)),
        ),
      ),
    );
  }

  Widget _buildBody() {
    switch (_viewModel.status) {
      case ChatListLoadStatus.loading:
        return const ChatListLoading();
      case ChatListLoadStatus.error:
        return AppEmptyState(
          icon: AppIcons.error,
          title: 'No se pudieron cargar las conversaciones',
          description: _viewModel.errorMessage,
          actionLabel: 'Reintentar',
          onActionPressed: _viewModel.retry,
        );
      case ChatListLoadStatus.success:
        final filtered = _filteredConversations;
        if (filtered.isEmpty && _viewModel.conversations.isNotEmpty) {
          return ChatListEmptyState(
            title: 'Nada en "${_selectedTab.label}"',
            description: _selectedTab == ConversationTab.unread
                ? 'No tienes mensajes sin leer.'
                : 'No tienes conversaciones pendientes de respuesta.',
          );
        }
        return filtered.isEmpty
            ? const ChatListEmptyState()
            : ConversationsList(
                conversations: filtered,
                onTap: _openConversation,
              );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: const ChatListHeader(),
      toolbar: [
        ConversationFilterTabs(
          selected: _selectedTab,
          onChanged: (tab) => setState(() => _selectedTab = tab),
        ),
      ],
      body: _buildBody(),
    );
  }
}
