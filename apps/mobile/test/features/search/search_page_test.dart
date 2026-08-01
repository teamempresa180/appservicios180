import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/category/entities/category.dart';
import 'package:mobile/category/models/category_id.dart';
import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/search/presentation/pages/search_page.dart';
import 'package:mobile/features/search/presentation/widgets/search_empty_state.dart';
import 'package:mobile/features/search/presentation/widgets/search_loading.dart';
import 'package:mobile/features/search/presentation/widgets/search_results.dart';
import 'package:mobile/features/search/repositories/mock_search_repository.dart';
import 'package:mobile/features/search/repositories/search_repository.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/provider/models/provider_id.dart';
import 'package:mobile/service/entities/service.dart';

/// Test double standing in for the real HTTP-backed repository — lets
/// each test control exactly what `getAll()` returns/throws and when,
/// without touching the global service locator. `getAll()` is always
/// empty/pending/throwing in the tests that use this fake, so
/// `providerOf`/`categoryOf`/`ratingOf`/`reviewsCountOf` are never
/// actually reached — they just delegate to a real
/// [MockSearchRepository] to satisfy the interface.
class _FakeSearchRepository implements SearchRepository {
  _FakeSearchRepository(this._result);

  final Future<List<Service>> Function() _result;
  final _delegate = MockSearchRepository();

  @override
  Future<List<Service>> getAll() => _result();

  @override
  Future<Provider> providerOf(ProviderId id) => _delegate.providerOf(id);

  @override
  Future<Category> categoryOf(CategoryId id) => _delegate.categoryOf(id);

  @override
  Future<double> ratingOf(ProviderId providerId) =>
      _delegate.ratingOf(providerId);

  @override
  Future<int> reviewsCountOf(ProviderId providerId) =>
      _delegate.reviewsCountOf(providerId);
}

void main() {
  Widget buildApp(Widget child) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(body: child),
    );
  }

  testWidgets('shows the header and the search bar accepts typing', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(SearchPage(repository: MockSearchRepository())),
    );
    await tester.pumpAndSettle();

    expect(find.text('Buscar servicios'), findsOneWidget);
    expect(
      find.text('Encuentra exactamente lo que necesitas.'),
      findsOneWidget,
    );

    await tester.enterText(find.byType(TextFormField), 'plomería');
    // Typing now drives real client-side filtering (see
    // `SearchViewModel.search`), which re-renders the results list with
    // fresh staggered `FadeIn`s — settle those before the test ends.
    await tester.pumpAndSettle();

    expect(find.text('plomería'), findsOneWidget);
  });

  testWidgets('results state shows all mock results with their fields', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(SearchPage(repository: MockSearchRepository())),
    );
    await tester.pumpAndSettle();

    expect(find.byType(SearchResults), findsOneWidget);
    expect(find.text('Reparación de fuga de agua'), findsOneWidget);
    // Two mock services share the Plomería category.
    expect(find.text('Plomería'), findsNWidgets(2));
    expect(find.text('Ver'), findsWidgets);
  });

  testWidgets('empty state shows the no-matches message', (tester) async {
    await tester.pumpWidget(
      buildApp(
        SearchPage(repository: _FakeSearchRepository(() async => const [])),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byType(SearchEmptyState), findsOneWidget);
    expect(find.text('Sin resultados'), findsOneWidget);
    expect(find.byType(SearchResults), findsNothing);
  });

  testWidgets('loading state shows SearchLoading instead of results', (
    tester,
  ) async {
    final completer = Completer<List<Service>>();
    await tester.pumpWidget(
      buildApp(
        SearchPage(repository: _FakeSearchRepository(() => completer.future)),
      ),
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

    completer.complete(const []);
    await tester.pumpAndSettle();
  });

  testWidgets('error state shows a retry action', (tester) async {
    await tester.pumpWidget(
      buildApp(
        SearchPage(
          repository: _FakeSearchRepository(
            () async => throw const NetworkHttpException('sin conexión'),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('No se pudieron cargar los resultados'), findsOneWidget);
    expect(find.text('Reintentar'), findsOneWidget);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(
      buildApp(SearchPage(repository: MockSearchRepository())),
    );
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
