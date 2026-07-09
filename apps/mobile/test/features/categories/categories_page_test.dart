import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/categories/presentation/pages/categories_page.dart';
import 'package:mobile/features/categories/presentation/widgets/categories_empty_state.dart';
import 'package:mobile/features/categories/presentation/widgets/categories_grid.dart';

void main() {
  Widget buildApp(Widget child) {
    return MaterialApp(theme: AppTheme.light, home: Scaffold(body: child));
  }

  testWidgets('normal state shows the header and all 12 categories', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(const CategoriesPage()));
    await tester.pumpAndSettle();

    expect(find.text('Todas las categorías'), findsOneWidget);
    expect(find.text('Explora todos los servicios disponibles.'), findsOneWidget);
    expect(find.text('Plomería'), findsOneWidget);
    expect(find.text('Electricidad'), findsOneWidget);
    expect(find.text('Limpieza'), findsOneWidget);
    expect(find.text('Jardinería'), findsOneWidget);
    expect(find.text('Pintura'), findsOneWidget);
    expect(find.text('Mascotas'), findsOneWidget);
    expect(find.text('Tecnología'), findsOneWidget);
    expect(find.text('Belleza'), findsOneWidget);
    expect(find.text('Construcción'), findsOneWidget);
    expect(find.text('Mudanzas'), findsOneWidget);
    expect(find.text('Cerrajería'), findsOneWidget);
    expect(find.text('Climatización'), findsOneWidget);
    expect(find.text('12 servicios'), findsOneWidget);
  });

  testWidgets('loading state shows AppLoading instead of the grid', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp(const CategoriesPage(isLoading: true)));
    await tester.pump(const Duration(milliseconds: 100));

    expect(find.text('Cargando categorías...'), findsOneWidget);
    expect(find.byType(CategoriesGrid), findsNothing);
  });

  testWidgets('empty state shows CategoriesEmptyState', (tester) async {
    await tester.pumpWidget(buildApp(const CategoriesPage(forceEmpty: true)));
    await tester.pumpAndSettle();

    expect(find.byType(CategoriesEmptyState), findsOneWidget);
    expect(find.text('Sin categorías disponibles'), findsOneWidget);
    expect(find.text('Plomería'), findsNothing);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp(const CategoriesPage()));
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
