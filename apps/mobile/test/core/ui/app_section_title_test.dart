import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_section_title.dart';

void main() {
  Widget buildApp(Widget child) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: child),
    );
  }

  testWidgets('shows only the title when nothing else is provided', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(const AppSectionTitle(title: 'Categorías')),
    );

    expect(find.text('Categorías'), findsOneWidget);
    expect(find.byType(TextButton), findsNothing);
  });

  testWidgets('shows the subtitle when provided', (tester) async {
    await tester.pumpWidget(
      buildApp(
        const AppSectionTitle(
          title: 'Categorías',
          subtitle: 'Elige una para empezar',
        ),
      ),
    );

    expect(find.text('Categorías'), findsOneWidget);
    expect(find.text('Elige una para empezar'), findsOneWidget);
  });

  testWidgets('renders a "Ver todo" action button and reports taps', (
    tester,
  ) async {
    var tapped = false;
    await tester.pumpWidget(
      buildApp(
        AppSectionTitle(
          title: 'Servicios recientes',
          actionLabel: 'Ver todo',
          onActionTap: () => tapped = true,
        ),
      ),
    );

    expect(find.text('Ver todo'), findsOneWidget);
    await tester.tap(find.text('Ver todo'));
    expect(tapped, isTrue);
  });

  testWidgets('trailing takes precedence over actionLabel', (tester) async {
    await tester.pumpWidget(
      buildApp(
        const AppSectionTitle(
          title: 'Categorías',
          actionLabel: 'Ver todo',
          trailing: Icon(Icons.filter_list),
        ),
      ),
    );

    expect(find.byIcon(Icons.filter_list), findsOneWidget);
    expect(find.text('Ver todo'), findsNothing);
  });
}
