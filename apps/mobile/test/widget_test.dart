import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/main.dart';

void main() {
  testWidgets('shows the Splash screen and then navigates to Onboarding', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const AppServiciosApp());

    expect(find.text('AppServicios'), findsOneWidget);
    expect(find.text('Inicializando...'), findsOneWidget);

    // Let the Splash screen's timed navigation fire.
    await tester.pump(const Duration(seconds: 3));
    await tester.pumpAndSettle();

    expect(find.text('En construcción'), findsOneWidget);
  });
}
