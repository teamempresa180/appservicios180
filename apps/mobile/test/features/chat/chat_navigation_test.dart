import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/chat/presentation/pages/chat_page.dart';
import 'package:mobile/features/chat/repositories/chat_repository.dart';
import 'package:mobile/features/chat/repositories/mock_chat_repository.dart';
import 'package:mobile/features/payments/presentation/pages/payments_page.dart';
import 'package:mobile/features/payments/repositories/mock_payments_repository.dart';
import 'package:mobile/features/payments/repositories/payments_repository.dart';

/// Confirms the minimal, explicitly-authorized wiring that lets
/// Payments open Chat — see the feature README (and `payments`' README)
/// for why "Ver recibo" is the button that opens it.
///
/// `ChatPage` is reached here via internal navigation (not constructed
/// directly by the test), so it always resolves its repository from
/// the service locator — hence registering a mock here.
void main() {
  setUp(() {
    locator.registerSingleton<ChatRepository>(MockChatRepository());
    locator.registerSingleton<PaymentsRepository>(MockPaymentsRepository());
  });
  tearDown(() => locator.reset());

  testWidgets('tapping "Ver recibo" in Payments opens Chat', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: const Scaffold(body: PaymentsPage()),
      ),
    );
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('Ver recibo'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Ver recibo'));
    await tester.pumpAndSettle();

    expect(find.byType(ChatPage), findsOneWidget);
    expect(find.text('Chat'), findsWidgets);
  });
}
