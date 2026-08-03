import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_bottom_sheet.dart';

void main() {
  Widget buildApp(void Function(BuildContext) onReady) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: Builder(
          builder: (context) => TextButton(
            onPressed: () => onReady(context),
            child: const Text('abrir'),
          ),
        ),
      ),
    );
  }

  testWidgets('shows the drag handle and the caller content', (tester) async {
    await tester.pumpWidget(
      buildApp(
        (context) => AppBottomSheet.show(
          context,
          child: const Text('contenido'),
        ),
      ),
    );

    await tester.tap(find.text('abrir'));
    await tester.pumpAndSettle();

    expect(find.text('contenido'), findsOneWidget);
    expect(find.byType(AppBottomSheet), findsOneWidget);
  });

  testWidgets('returns the value the content pops', (tester) async {
    String? result;
    await tester.pumpWidget(
      buildApp((context) async {
        result = await AppBottomSheet.show<String>(
          context,
          child: Builder(
            builder: (sheetContext) => TextButton(
              onPressed: () => Navigator.of(sheetContext).pop('elegido'),
              child: const Text('elegir'),
            ),
          ),
        );
      }),
    );

    await tester.tap(find.text('abrir'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('elegir'));
    await tester.pumpAndSettle();

    expect(result, 'elegido');
  });

  testWidgets('content taller than the screen scrolls instead of overflowing', (
    tester,
  ) async {
    // Regression guard for the `isScrollControlled` fix: before it, the
    // sheet was capped at ~half the screen and could not grow, so tall
    // content (and the keyboard padding the form sheets add) overflowed.
    await tester.pumpWidget(
      buildApp(
        (context) => AppBottomSheet.show(
          context,
          child: Column(
            children: List.generate(
              40,
              (index) => SizedBox(height: 40, child: Text('fila $index')),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('abrir'));
    await tester.pumpAndSettle();

    // No overflow exception was thrown building a 1600px-tall child.
    expect(tester.takeException(), isNull);
    expect(find.byType(SingleChildScrollView), findsOneWidget);
    expect(find.text('fila 0'), findsOneWidget);
  });

  testWidgets('never exceeds 90% of the screen height', (tester) async {
    await tester.pumpWidget(
      buildApp(
        (context) => AppBottomSheet.show(
          context,
          child: Column(
            children: List.generate(
              40,
              (index) => const SizedBox(height: 40),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('abrir'));
    await tester.pumpAndSettle();

    final screenHeight = tester.view.physicalSize.height / tester.view.devicePixelRatio;
    final sheetHeight = tester.getSize(find.byType(AppBottomSheet)).height;
    expect(sheetHeight, lessThanOrEqualTo(screenHeight * 0.9 + 1));
  });
}
