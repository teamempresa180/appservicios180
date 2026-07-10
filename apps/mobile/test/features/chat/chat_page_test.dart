import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/chat/presentation/pages/chat_page.dart';
import 'package:mobile/features/chat/presentation/widgets/chat_messages.dart';
import 'package:mobile/features/chat/presentation/widgets/message_bubble.dart';
import 'package:mobile/features/chat/presentation/widgets/message_input.dart';
import 'package:mobile/features/chat/presentation/widgets/provider_header.dart';
import 'package:mobile/features/chat/presentation/widgets/typing_indicator.dart';

void main() {
  Widget buildApp({ChatViewState state = ChatViewState.conversation}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: ChatPage(state: state)),
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
    await tester.pumpWidget(buildApp(state: ChatViewState.loading));
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
    await tester.pumpWidget(buildApp(state: ChatViewState.empty));
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
