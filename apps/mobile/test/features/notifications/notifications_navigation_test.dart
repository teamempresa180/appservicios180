import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/chat/presentation/pages/chat_page.dart';
import 'package:mobile/features/chat/repositories/mock_chat_repository.dart';
import 'package:mobile/features/notifications/presentation/pages/notifications_page.dart';
import 'package:mobile/features/notifications/repositories/mock_notifications_repository.dart';
import 'package:mobile/features/notifications/repositories/notifications_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets Chat
/// open Notifications — see the feature README (and `chat`'s README)
/// for why "Más opciones" is the button that opens it.
///
/// `NotificationsPage` is reached here via internal navigation (not
/// constructed directly by the test), so it always resolves its
/// repository from the service locator — hence registering a mock here.
void main() {
  setUp(
    () => locator.registerSingleton<NotificationsRepository>(
      MockNotificationsRepository(),
    ),
  );
  tearDown(() => locator.reset());

  testWidgets('tapping "Más opciones" in Chat opens Notifications', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(body: ChatPage(repository: MockChatRepository())),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.byIcon(Icons.more_vert));
    await tester.pumpAndSettle();
    await tester.tap(find.byIcon(Icons.more_vert));
    await tester.pumpAndSettle();

    expect(find.byType(NotificationsPage), findsOneWidget);
    expect(find.text('Notificaciones'), findsWidgets);
  });
}
