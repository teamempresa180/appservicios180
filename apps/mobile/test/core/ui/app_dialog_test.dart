import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_button.dart';
import 'package:mobile/core/ui/widgets/app_dialog.dart';

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

  testWidgets('shows the title, content and actions', (tester) async {
    await tester.pumpWidget(
      buildApp(
        (context) => AppDialog.show(
          context,
          title: 'Eliminar dirección',
          content: const Text('Esta acción no se puede deshacer.'),
          actions: [
            AppButton(
              label: 'Cancelar',
              onPressed: () {},
              expand: false,
              variant: AppButtonVariant.text,
            ),
          ],
        ),
      ),
    );

    await tester.tap(find.text('abrir'));
    await tester.pumpAndSettle();

    expect(find.text('Eliminar dirección'), findsOneWidget);
    expect(find.text('Esta acción no se puede deshacer.'), findsOneWidget);
    expect(find.text('Cancelar'), findsOneWidget);
  });

  testWidgets('two long action labels wrap instead of overflowing', (
    tester,
  ) async {
    // Regression guard: the actions used to sit in a `Row`, which threw a
    // horizontal overflow once the two Spanish labels exceeded the
    // dialog width on a narrow screen.
    tester.view.physicalSize = const Size(320, 640);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(
      buildApp(
        (context) => AppDialog.show(
          context,
          title: 'Confirmar',
          content: const Text('¿Seguro?'),
          actions: [
            AppButton(
              label: 'Cancelar y volver atrás',
              onPressed: () {},
              expand: false,
              variant: AppButtonVariant.text,
            ),
            AppButton(
              label: 'Confirmar eliminación',
              onPressed: () {},
              expand: false,
            ),
          ],
        ),
      ),
    );

    await tester.tap(find.text('abrir'));
    await tester.pumpAndSettle();

    expect(tester.takeException(), isNull);
    expect(find.text('Cancelar y volver atrás'), findsOneWidget);
    expect(find.text('Confirmar eliminación'), findsOneWidget);
  });

  testWidgets('long content scrolls rather than overflowing the screen', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(
        (context) => AppDialog.show(
          context,
          title: 'Términos',
          content: Column(
            children: List.generate(
              40,
              (index) => SizedBox(height: 40, child: Text('párrafo $index')),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('abrir'));
    await tester.pumpAndSettle();

    expect(tester.takeException(), isNull);
    expect(find.byType(SingleChildScrollView), findsOneWidget);
    // The title stays pinned outside the scrolling body.
    expect(find.text('Términos'), findsOneWidget);
  });
}
