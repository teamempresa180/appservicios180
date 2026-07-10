import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/profile/presentation/pages/profile_page.dart';
import 'package:mobile/features/profile/presentation/widgets/profile_address.dart';
import 'package:mobile/features/profile/presentation/widgets/profile_contact.dart';
import 'package:mobile/features/profile/presentation/widgets/profile_information.dart';
import 'package:mobile/features/profile/presentation/widgets/profile_statistics.dart';

void main() {
  Widget buildApp({ProfileViewState state = ProfileViewState.information}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: ProfilePage(state: state)),
    );
  }

  testWidgets('shows the header with the display name', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Perfil'), findsOneWidget);
    expect(find.text('Camila Torres'), findsWidgets);
  });

  testWidgets('shows the identity information with member-since', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProfileInformation), findsOneWidget);
    expect(find.textContaining('Miembro desde'), findsOneWidget);
  });

  testWidgets('shows every real contact channel', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProfileContact), findsOneWidget);
    expect(find.text('camila.torres@example.com'), findsOneWidget);
    expect(find.text('+57 300 123 4567'), findsOneWidget);
  });

  testWidgets('shows the real address', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProfileAddress), findsOneWidget);
    expect(find.text('Casa'), findsOneWidget);
  });

  testWidgets('shows the simulated completion percentage and checklist', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProfileStatistics), findsOneWidget);
    expect(find.text('75%'), findsOneWidget);
    expect(find.text('Agrega una foto de perfil'), findsOneWidget);
  });

  testWidgets('shows both profile actions', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Editar perfil'), findsOneWidget);
    expect(find.text('Cerrar sesión'), findsOneWidget);
  });

  testWidgets('loading state shows AppLoading instead of the information', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(state: ProfileViewState.loading));
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(ProfileInformation), findsNothing);
  });

  testWidgets('empty state shows AppEmptyState instead of the information', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(state: ProfileViewState.empty));
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.byType(ProfileInformation), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
