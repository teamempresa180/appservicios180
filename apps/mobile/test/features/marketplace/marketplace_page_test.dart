import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/marketplace/presentation/pages/marketplace_page.dart';
import 'package:mobile/features/marketplace/repositories/mock_category_repository.dart';
import 'package:mobile/features/marketplace/repositories/mock_provider_repository.dart';
import 'package:mobile/features/marketplace/repositories/mock_service_repository.dart';

void main() {
  Widget buildApp() {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: MarketplacePage(
          categoryRepository: MockCategoryRepository(),
          serviceRepository: MockServiceRepository(),
          providerRepository: MockProviderRepository(),
        ),
      ),
    );
  }

  testWidgets('shows the header, search bar and section titles', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Explora servicios'), findsOneWidget);
    expect(find.text('Encuentra el profesional ideal.'), findsOneWidget);
    expect(find.text('Buscar servicios o profesionales'), findsOneWidget);
    expect(find.text('Categorías'), findsOneWidget);
    expect(find.text('Servicios destacados'), findsOneWidget);
    expect(find.text('Proveedores recomendados'), findsOneWidget);
  });

  testWidgets('shows mock categories', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    // Plomería, Electricidad, Limpieza and Jardinería each also appear
    // as the resolved category of a featured service card, so they
    // legitimately show up twice (chip + card).
    expect(find.text('Plomería'), findsNWidgets(2));
    expect(find.text('Electricidad'), findsNWidgets(2));
    expect(find.text('Limpieza'), findsNWidgets(2));
    expect(find.text('Jardinería'), findsNWidgets(2));
    expect(find.text('Pintura'), findsOneWidget);
    expect(find.text('Mascotas'), findsOneWidget);
    expect(find.text('Tecnología'), findsOneWidget);
    expect(find.text('Belleza'), findsOneWidget);
  });

  testWidgets('shows featured services with resolved provider/category names', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Reparación de fuga de agua'), findsOneWidget);
    // "Ana Torres" is both the resolved provider name on the service
    // card and a recommended provider card further down.
    expect(find.text('Ana Torres'), findsNWidgets(2));
  });

  testWidgets('shows recommended providers with resolved names', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    // "Carlos Ramírez" appears both as the resolved provider of the
    // "Instalación de lámparas" service card and as his own provider
    // card.
    expect(find.text('Carlos Ramírez'), findsNWidgets(2));
    expect(find.text('4 servicios'), findsOneWidget);
  });

  testWidgets('does not build its own Scaffold (lives inside the Shell)', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
