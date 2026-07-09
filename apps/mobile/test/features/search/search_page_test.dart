import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/search/presentation/pages/search_page.dart';
import 'package:mobile/features/search/presentation/widgets/search_empty_state.dart';
import 'package:mobile/features/search/presentation/widgets/search_loading.dart';
import 'package:mobile/features/search/presentation/widgets/search_results.dart';

void main() {
  Widget buildApp(Widget child) {
    return MaterialApp(theme: AppTheme.light, home: Scaffold(body: child));
  }

  testWidgets('shows the header and the search bar accepts typing', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(const SearchPage()));
    await tester.pumpAndSettle();

    expect(find.text('Buscar servicios'), findsOneWidget);
    expect(find.text('Encuentra exactamente lo que necesitas.'), findsOneWidget);

    await tester.enterText(find.byType(TextFormField), 'plomería');
    await tester.pump();

    expect(find.text('plomería'), findsOneWidget);
  });

  testWidgets('results state shows all mock results with their fields', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(const SearchPage()));
    await tester.pumpAndSettle();

    expect(find.byType(SearchResults), findsOneWidget);
    expect(find.text('Reparación de fuga de agua'), findsOneWidget);
    // Two mock services share the Plomería category.
    expect(find.text('Plomería'), findsNWidgets(2));
    expect(find.text('Ver'), findsWidgets);
  });

  testWidgets('empty state shows the initial prompt', (tester) async {
    await tester.pumpWidget(
      buildApp(const SearchPage(state: SearchViewState.empty)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(SearchEmptyState), findsOneWidget);
    expect(find.text('Busca un servicio'), findsOneWidget);
    expect(find.byType(SearchResults), findsNothing);
  });

  testWidgets('noResults state shows the no-matches message', (tester) async {
    await tester.pumpWidget(
      buildApp(const SearchPage(state: SearchViewState.noResults)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(SearchEmptyState), findsOneWidget);
    expect(find.text('Sin resultados'), findsOneWidget);
  });

  testWidgets('loading state shows SearchLoading instead of results', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(const SearchPage(state: SearchViewState.loading)),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(SearchLoading), findsOneWidget);
    expect(find.text('Buscando servicios...'), findsOneWidget);
    expect(find.byType(SearchResults), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp(const SearchPage()));
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
