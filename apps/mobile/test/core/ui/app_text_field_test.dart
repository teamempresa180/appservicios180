import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_text_field.dart';

void main() {
  Widget buildApp(Widget child) {
    return MaterialApp(theme: AppTheme.light, home: Scaffold(body: child));
  }

  testWidgets('shows label, hint, prefix and suffix icons', (tester) async {
    await tester.pumpWidget(
      buildApp(
        AppTextField(
          label: 'Correo electrónico',
          hint: 'Ingresa tu correo',
          prefixIcon: Icons.email_outlined,
          suffixIcon: const Icon(Icons.check),
        ),
      ),
    );

    expect(find.text('Correo electrónico'), findsOneWidget);
    expect(find.byIcon(Icons.email_outlined), findsOneWidget);
    expect(find.byIcon(Icons.check), findsOneWidget);
  });

  testWidgets('disabled field is not enabled', (tester) async {
    await tester.pumpWidget(buildApp(const AppTextField(enabled: false)));

    final field = tester.widget<TextFormField>(find.byType(TextFormField));
    expect(field.enabled, isFalse);
  });

  testWidgets('shows the validator error message when invalid', (
    tester,
  ) async {
    final formKey = GlobalKey<FormState>();
    await tester.pumpWidget(
      buildApp(
        Form(
          key: formKey,
          child: AppTextField(
            label: 'Correo',
            validator: (value) =>
                (value == null || value.isEmpty) ? 'Requerido' : null,
          ),
        ),
      ),
    );

    formKey.currentState!.validate();
    await tester.pump();

    expect(find.text('Requerido'), findsOneWidget);
  });
}
