import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/contact_management/presentation/pages/contact_management_page.dart';
import 'package:mobile/features/contact_management/presentation/widgets/contact_card.dart';
import 'package:mobile/features/contact_management/presentation/widgets/contacts_statistics.dart';

void main() {
  Widget buildApp({
    ContactManagementViewState state = ContactManagementViewState.information,
  }) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: ContactManagementPage(state: state)),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Mis contactos'), findsOneWidget);
  });

  testWidgets('shows statistics derived from the real contacts', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ContactsStatistics), findsOneWidget);
    // 3 active, 1 inactive, 1 archived.
    expect(find.text('3'), findsOneWidget);
    expect(find.text('1'), findsNWidgets(2));
  });

  testWidgets('shows every mock contact with its value and status', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ContactCard), findsNWidgets(5));
    expect(find.text('camila.torres@example.com'), findsOneWidget);
    expect(find.text('+57 310 456 7890'), findsOneWidget);
    expect(find.text('Activo'), findsNWidgets(3));
    expect(find.text('Inactivo'), findsOneWidget);
    expect(find.text('Archivado'), findsOneWidget);
  });

  testWidgets('shows edit/delete actions for every contact', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Editar'), findsNWidgets(5));
    expect(find.text('Eliminar'), findsNWidgets(5));
  });

  testWidgets('shows the add-contact button', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Agregar contacto'), findsOneWidget);
  });

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(state: ContactManagementViewState.loading),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(ContactCard), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(state: ContactManagementViewState.empty));
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(ContactCard), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
