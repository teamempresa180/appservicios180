import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/address_management/presentation/pages/address_management_page.dart';
import 'package:mobile/features/address_management/presentation/widgets/address_card.dart';
import 'package:mobile/features/address_management/presentation/widgets/address_form_preview.dart';
import 'package:mobile/features/address_management/presentation/widgets/default_address_badge.dart';

void main() {
  Widget buildApp({
    AddressManagementViewState state = AddressManagementViewState.information,
  }) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: AddressManagementPage(state: state)),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Mis direcciones'), findsOneWidget);
  });

  testWidgets('shows every mock address with its city and state', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AddressCard), findsNWidgets(3));
    expect(find.text('Casa'), findsOneWidget);
    expect(find.text('Trabajo'), findsOneWidget);
    expect(find.text('Oficina'), findsOneWidget);
    expect(find.text('Bogotá, Cundinamarca'), findsNWidgets(3));
  });

  testWidgets('shows the default badge only for the default address', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Principal'), findsOneWidget);
    expect(find.byType(DefaultAddressBadge), findsNWidgets(3));
  });

  testWidgets('shows edit/delete/select actions for every address', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Editar'), findsNWidgets(3));
    expect(find.text('Eliminar'), findsNWidgets(3));
    expect(find.text('Seleccionar'), findsNWidgets(3));
  });

  testWidgets('shows the add-address button and the form preview', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Agregar dirección'), findsOneWidget);
    expect(find.byType(AddressFormPreview), findsOneWidget);
    expect(find.text('Guardar'), findsOneWidget);
  });

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(state: AddressManagementViewState.loading),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(AddressCard), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(state: AddressManagementViewState.empty),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(AddressCard), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
