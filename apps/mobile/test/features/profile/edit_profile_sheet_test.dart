import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/profile/presentation/widgets/edit_profile_sheet.dart';

/// Wraps the pending `Future` in a non-Future holder — returning a bare
/// `Future<EditProfileResult?>` from an `async` helper whose own return
/// type is that same `Future<T>` makes Dart flatten/await it before the
/// helper itself returns (there is no separate "open" vs. "resolved"
/// moment), which deadlocks any test that opens the sheet without
/// immediately saving/cancelling it.
class _Opened {
  _Opened(this.result);
  final Future<EditProfileResult?> result;
}

void main() {
  // Deliberately avoids `pumpAndSettle()` for the modal bottom sheet's
  // open transition — same reasoning as `chat_page_test.dart`'s
  // loading test: an explicit `pump()` sequence is used instead so a
  // stray still-animating frame can't leave the test hanging.
  Future<_Opened> pumpAndOpen(WidgetTester tester) async {
    late final Future<EditProfileResult?> resultFuture;
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(
          body: Builder(
            builder: (context) => ElevatedButton(
              onPressed: () {
                resultFuture = EditProfileSheet.show(
                  context,
                  currentName: 'Camila Torres',
                  currentPhone: '+57 300 123 4567',
                  currentEmail: 'camila.torres@example.com',
                  currentAddressAlias: 'Casa',
                  currentFullAddress: 'Calle 45 # 12-30, Apto 501',
                );
              },
              child: const Text('open'),
            ),
          ),
        ),
      ),
    );
    await tester.tap(find.text('open'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));
    return _Opened(resultFuture);
  }

  testWidgets('pre-fills every field with the current values', (
    tester,
  ) async {
    await pumpAndOpen(tester);

    expect(find.text('Camila Torres'), findsOneWidget);
    expect(find.text('+57 300 123 4567'), findsOneWidget);
    expect(find.text('camila.torres@example.com'), findsOneWidget);
    expect(find.text('Casa'), findsOneWidget);
    expect(find.text('Calle 45 # 12-30, Apto 501'), findsOneWidget);
  });

  testWidgets('saving with unchanged values returns them all back', (
    tester,
  ) async {
    final opened = await pumpAndOpen(tester);

    await tester.tap(find.text('Guardar'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));

    final result = await opened.result;
    expect(result, isNotNull);
    expect(result!.displayName, 'Camila Torres');
    expect(result.phone, '+57 300 123 4567');
    expect(result.email, 'camila.torres@example.com');
    expect(result.addressAlias, 'Casa');
    expect(result.fullAddress, 'Calle 45 # 12-30, Apto 501');
  });

  testWidgets('editing a field returns the new value on save', (
    tester,
  ) async {
    final opened = await pumpAndOpen(tester);

    await tester.enterText(
      find.widgetWithText(TextFormField, 'Correo electrónico'),
      'nuevo@example.com',
    );
    await tester.tap(find.text('Guardar'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));

    final result = await opened.result;
    expect(result!.email, 'nuevo@example.com');
  });

  testWidgets('rejects an invalid email', (tester) async {
    await pumpAndOpen(tester);

    await tester.enterText(
      find.widgetWithText(TextFormField, 'Correo electrónico'),
      'not-an-email',
    );
    await tester.tap(find.text('Guardar'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Ingresa un correo válido'), findsOneWidget);
  });

  testWidgets('rejects an empty required field', (tester) async {
    await pumpAndOpen(tester);

    await tester.enterText(
      find.widgetWithText(TextFormField, 'Nombre para mostrar'),
      '',
    );
    await tester.tap(find.text('Guardar'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Este campo es obligatorio'), findsOneWidget);
  });
}
