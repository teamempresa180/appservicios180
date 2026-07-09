import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/service_detail/presentation/pages/service_detail_page.dart';
import 'package:mobile/features/service_detail/presentation/widgets/provider_information.dart';
import 'package:mobile/features/service_detail/presentation/widgets/rating_summary.dart';
import 'package:mobile/features/service_detail/presentation/widgets/service_gallery.dart';
import 'package:mobile/features/service_detail/presentation/widgets/service_information.dart';

void main() {
  Widget buildApp() {
    return MaterialApp(
      theme: AppTheme.light,
      home: const Scaffold(body: ServiceDetailPage()),
    );
  }

  testWidgets('shows the header with service name and category', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Reparación de fuga de agua'), findsOneWidget);
    expect(find.text('Plomería'), findsOneWidget);
  });

  testWidgets('shows the simulated gallery', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ServiceGallery), findsOneWidget);
    expect(find.text('Imagen principal'), findsOneWidget);
    expect(find.text('Resultado final'), findsOneWidget);
  });

  testWidgets('shows the long description and base price', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ServiceInformation), findsOneWidget);
    expect(find.textContaining('Servicio profesional'), findsOneWidget);
    expect(find.text('\$45'), findsOneWidget);
  });

  testWidgets('shows the provider name and biography', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderInformation), findsOneWidget);
    expect(find.text('Diana Restrepo'), findsOneWidget);
    expect(find.text('8 años de experiencia'), findsOneWidget);
  });

  testWidgets('shows the aggregate rating, reviews count and each review', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(RatingSummary), findsOneWidget);
    expect(find.text('3 reseñas'), findsOneWidget);
    // Average of 5, 4, 5 = 4.7 (rounded to one decimal).
    expect(find.text('4.7'), findsOneWidget);
    expect(find.text('Excelente trabajo'), findsOneWidget);
    expect(find.text('Muy buen servicio'), findsOneWidget);
    expect(find.text('Recomendado'), findsOneWidget);
  });

  testWidgets('shows the "Solicitar servicio" button', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Solicitar servicio'), findsOneWidget);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
