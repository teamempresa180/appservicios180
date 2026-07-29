import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/attachment/entities/attachment.dart';
import 'package:mobile/chat/entities/chat.dart';
import 'package:mobile/chat/models/chat_id.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/chat/models/conversation_summary.dart';
import 'package:mobile/features/chat/presentation/pages/chat_list_page.dart';
import 'package:mobile/features/chat/presentation/pages/chat_page.dart';
import 'package:mobile/features/chat/presentation/widgets/conversation_tile.dart';
import 'package:mobile/features/chat/repositories/chat_repository.dart';
import 'package:mobile/features/chat/repositories/mock_chat_repository.dart';
import 'package:mobile/message/entities/message.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/provider/models/provider_id.dart';

final List<ConversationSummary> _fixtures = [
  ConversationSummary(
    chatId: ChatId.fromString('fixture-unread'),
    counterpartName: 'Carlos Gómez',
    lastMessagePreview: '¿Puedes venir mañana?',
    lastMessageAt: DateTime.now().subtract(const Duration(minutes: 5)),
    unreadCount: 2,
    isUnanswered: true,
  ),
  ConversationSummary(
    chatId: ChatId.fromString('fixture-answered'),
    counterpartName: 'Ferretería Central',
    lastMessagePreview: 'Con gusto, quedamos así.',
    lastMessageAt: DateTime.now().subtract(const Duration(hours: 2)),
    unreadCount: 0,
    isUnanswered: false,
  ),
];

/// Wraps [MockChatRepository] so tests can control the conversation
/// list independently of the fixed single-chat mock data — same
/// forwarding pattern as `chat_page_test.dart`'s `_FakeChatRepository`.
class _FakeChatRepository implements ChatRepository {
  _FakeChatRepository({
    this.neverResolves = false,
    List<ConversationSummary>? conversations,
  }) : conversations = conversations ?? _fixtures;

  final bool neverResolves;
  final List<ConversationSummary> conversations;
  final _delegate = MockChatRepository();

  @override
  Future<Chat> getChat() => _delegate.getChat();

  @override
  Future<Provider> getProvider() => _delegate.getProvider();

  @override
  Future<Profile> getProfile() => _delegate.getProfile();

  @override
  Future<Order> getOrder() => _delegate.getOrder();

  @override
  Future<List<Message>> getMessages() => _delegate.getMessages();

  @override
  Future<List<Attachment>> getAttachments() => _delegate.getAttachments();

  @override
  Future<List<ConversationSummary>> getConversations() {
    if (neverResolves) return Completer<List<ConversationSummary>>().future;
    return Future.value(conversations);
  }

  @override
  Future<Chat> createOrGetForOrder(Order order, ProviderId providerId) =>
      _delegate.createOrGetForOrder(order, providerId);
}

void main() {
  Widget buildApp({ChatRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: ChatListPage(repository: repository)),
    );
  }

  testWidgets('shows every conversation with its unread/answered state', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeChatRepository()),
    );
    await tester.pumpAndSettle();

    expect(find.byType(ConversationTile), findsNWidgets(2));
    expect(find.text('Carlos Gómez'), findsOneWidget);
    expect(find.text('Ferretería Central'), findsOneWidget);
    expect(find.text('2'), findsOneWidget); // unread badge
  });

  testWidgets('"No leídos" filters to only conversations with unreadCount > 0', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(repository: _FakeChatRepository()));
    await tester.pumpAndSettle();

    await tester.tap(find.text('No leídos'));
    await tester.pumpAndSettle();

    expect(find.text('Carlos Gómez'), findsOneWidget);
    expect(find.text('Ferretería Central'), findsNothing);
  });

  testWidgets(
    '"Sin responder" filters to only conversations awaiting a reply',
    (tester) async {
      await tester.pumpWidget(buildApp(repository: _FakeChatRepository()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Sin responder'));
      await tester.pumpAndSettle();

      expect(find.text('Carlos Gómez'), findsOneWidget);
      expect(find.text('Ferretería Central'), findsNothing);
    },
  );

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeChatRepository(neverResolves: true)),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the list's staggered FadeIn
    // still needs a couple of pumps to resolve, or its delayed Future
    // leaves a dangling Timer at test teardown (same as
    // chat_page_test.dart's loading test).
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(ConversationTile), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState when there are no chats', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeChatRepository(conversations: const [])),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(ConversationTile), findsNothing);
  });

  testWidgets('tapping a conversation opens ChatPage', (tester) async {
    await tester.pumpWidget(buildApp(repository: _FakeChatRepository()));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Carlos Gómez'));
    await tester.pumpAndSettle();

    expect(find.byType(ChatPage), findsOneWidget);
    expect(
      find.descendant(of: find.byType(AppBar), matching: find.text('Carlos Gómez')),
      findsOneWidget,
    );
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp(repository: _FakeChatRepository()));
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
  });
}
