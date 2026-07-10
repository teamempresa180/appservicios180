import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_button.dart';

void main() {
  Widget buildApp(Widget child) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: child),
    );
  }

  testWidgets('normal state is enabled and shows the label', (tester) async {
    var tapped = false;
    await tester.pumpWidget(
      buildApp(AppButton(label: 'Continuar', onPressed: () => tapped = true)),
    );

    expect(find.text('Continuar'), findsOneWidget);
    final button = tester.widget<FilledButton>(find.byType(FilledButton));
    expect(button.onPressed, isNotNull);

    await tester.tap(find.byType(FilledButton));
    expect(tapped, isTrue);
  });

  testWidgets('disabled state has a null onPressed', (tester) async {
    await tester.pumpWidget(
      buildApp(const AppButton(label: 'Continuar', onPressed: null)),
    );

    final button = tester.widget<FilledButton>(find.byType(FilledButton));
    expect(button.onPressed, isNull);
  });

  testWidgets('loading state disables the button and shows a spinner', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(
        AppButton(label: 'Continuar', onPressed: () {}, isLoading: true),
      ),
    );
    await tester.pump(const Duration(milliseconds: 200));

    final button = tester.widget<FilledButton>(find.byType(FilledButton));
    expect(button.onPressed, isNull);
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    expect(find.text('Continuar'), findsNothing);
  });

  testWidgets('has a uniform minimum height across states', (tester) async {
    await tester.pumpWidget(
      buildApp(AppButton(label: 'Continuar', onPressed: () {})),
    );
    final normalHeight = tester.getSize(find.byType(FilledButton)).height;

    await tester.pumpWidget(
      buildApp(
        AppButton(label: 'Continuar', onPressed: () {}, isLoading: true),
      ),
    );
    await tester.pump(const Duration(milliseconds: 200));
    final loadingHeight = tester.getSize(find.byType(FilledButton)).height;

    expect(normalHeight, equals(loadingHeight));
    expect(normalHeight, greaterThanOrEqualTo(48));
  });
}
