import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/attachment/entities/attachment.dart';
import 'package:mobile/chat/entities/chat.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/chat/presentation/pages/chat_page.dart';
import 'package:mobile/features/chat/presentation/widgets/attachment_preview.dart';
import 'package:mobile/features/chat/presentation/widgets/chat_messages.dart';
import 'package:mobile/features/chat/presentation/widgets/message_bubble.dart';
import 'package:mobile/features/chat/presentation/widgets/message_input.dart';
import 'package:mobile/features/chat/presentation/widgets/provider_header.dart';
import 'package:mobile/features/chat/presentation/widgets/typing_indicator.dart';
import 'package:mobile/features/chat/repositories/chat_repository.dart';
import 'package:mobile/features/chat/repositories/mock_chat_repository.dart';
import 'package:mobile/features/chat/models/conversation_summary.dart';
import 'package:mobile/message/entities/message.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/provider/models/provider_id.dart';

/// Wraps [MockChatRepository] (already `Future`-returning) so tests
/// can force it to never resolve (loading state) or return no
/// messages (empty state), without touching the real mock data.
class _FakeChatRepository implements ChatRepository {
  _FakeChatRepository({this.neverResolves = false, this.forceEmpty = false});

  final bool neverResolves;
  final bool forceEmpty;
  final _delegate = MockChatRepository();

  @override
  Future<Chat> getChat() {
    if (neverResolves) return Completer<Chat>().future;
    return _delegate.getChat();
  }

  @override
  Future<Provider> getProvider() => _delegate.getProvider();

  @override
  Future<Profile> getProfile() => _delegate.getProfile();

  @override
  Future<Order> getOrder() => _delegate.getOrder();

  @override
  Future<List<Message>> getMessages() =>
      forceEmpty ? Future.value(const []) : _delegate.getMessages();

  @override
  Future<List<Attachment>> getAttachments() =>
      forceEmpty ? Future.value(const []) : _delegate.getAttachments();

  @override
  Future<List<ConversationSummary>> getConversations() =>
      _delegate.getConversations();

  @override
  Future<Chat> createOrGetForOrder(Order order, ProviderId providerId) =>
      _delegate.createOrGetForOrder(order, providerId);
}

void main() {
  Widget buildApp({ChatRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: ChatPage(repository: repository ?? _FakeChatRepository())),
    );
  }

  testWidgets('shows the header with the order title', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Chat'), findsOneWidget);
    expect(find.text('Reparación de fuga de agua'), findsOneWidget);
  });

  testWidgets('shows the provider header with online status', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderHeader), findsOneWidget);
    expect(find.text('Diana Restrepo'), findsOneWidget);
    expect(find.text('En línea'), findsOneWidget);
  });

  testWidgets('shows every message in the alternating conversation', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ChatMessages), findsOneWidget);
    expect(find.byType(MessageBubble), findsNWidgets(4));
    expect(find.textContaining('Ya estoy en camino'), findsOneWidget);
    expect(find.textContaining('Perfecto, muchas gracias'), findsOneWidget);
  });

  testWidgets('shows every mock attachment across the conversation', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AttachmentPreview), findsNWidgets(5));
    expect(find.textContaining('foto_fuga.jpg'), findsOneWidget);
    expect(find.textContaining('cotizacion.pdf'), findsOneWidget);
    expect(find.textContaining('nota_voz.m4a'), findsOneWidget);
    expect(find.textContaining('video_diagnostico.mp4'), findsOneWidget);
    expect(find.textContaining('archivo_temporal.zip'), findsOneWidget);
  });

  testWidgets('does not show the typing indicator by default', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(TypingIndicator), findsNothing);
  });

  testWidgets('shows a functional-looking message input with a no-op send', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(MessageInput), findsOneWidget);
    await tester.enterText(find.byType(TextField), 'Hola');
    await tester.pump();
    expect(find.text('Hola'), findsOneWidget);

    await tester.ensureVisible(find.byIcon(Icons.send_outlined));
    await tester.pumpAndSettle();
    await tester.tap(find.byIcon(Icons.send_outlined));
    await tester.pumpAndSettle();

    // Sending is a no-op — no new bubble is added, and the typed text
    // is not cleared or sent anywhere.
    expect(find.byType(MessageBubble), findsNWidgets(4));
  });

  testWidgets('loading state shows AppLoading instead of the conversation', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeChatRepository(neverResolves: true)),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(MessageBubble), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the conversation', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeChatRepository(forceEmpty: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(MessageBubble), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
