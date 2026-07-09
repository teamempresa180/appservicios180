import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_profile/presentation/pages/provider_profile_page.dart';
import 'package:mobile/features/provider_profile/presentation/widgets/provider_availability.dart';
import 'package:mobile/features/provider_profile/presentation/widgets/provider_information.dart';
import 'package:mobile/features/provider_profile/presentation/widgets/provider_reviews_summary.dart';
import 'package:mobile/features/provider_profile/presentation/widgets/provider_services.dart';
import 'package:mobile/features/provider_profile/presentation/widgets/provider_specialties.dart';
import 'package:mobile/features/provider_profile/presentation/widgets/provider_statistics.dart';

void main() {
  Widget buildApp() {
    return MaterialApp(
      theme: AppTheme.light,
      home: const Scaffold(body: ProviderProfilePage()),
    );
  }

  testWidgets('shows the header with name and aggregate rating', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Diana Restrepo'), findsOneWidget);
    // Average of 5, 4, 5, 4 = 4.5.
    expect(find.text('4.5'), findsWidgets);
    expect(find.text('(4 reseñas)'), findsOneWidget);
  });

  testWidgets('shows the about description', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderInformation), findsOneWidget);
    expect(find.textContaining('Plomera independiente'), findsOneWidget);
  });

  testWidgets('shows experience, completed services and response time', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderStatistics), findsOneWidget);
    expect(find.text('8'), findsOneWidget); // yearsOfExperience
    expect(find.text('47'), findsOneWidget); // completedServices
  });

  testWidgets('shows every specialty as a chip', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderSpecialties), findsOneWidget);
    expect(find.text('Reparación de fugas'), findsOneWidget);
    // "Instalación de tuberías" is both a specialty chip and the name
    // of a published service further down, so it legitimately appears
    // twice on the page.
    expect(find.text('Instalación de tuberías'), findsNWidgets(2));
    expect(find.text('Mantenimiento preventivo'), findsOneWidget);
    expect(find.text('Grifería'), findsOneWidget);
  });

  testWidgets('shows every published service with its price', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderServices), findsOneWidget);
    expect(find.text('Reparación de fuga de agua'), findsOneWidget);
    expect(find.text('Instalación de tuberías'), findsNWidgets(2));
    expect(find.text('Instalación de grifería'), findsOneWidget);
    expect(find.text('\$45'), findsOneWidget);
  });

  testWidgets('shows availability status and hours', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderAvailability), findsOneWidget);
    expect(find.text('Disponible'), findsOneWidget);
    expect(find.text('08:00 - 18:00'), findsOneWidget);
  });

  testWidgets('shows the reviews summary with each review', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderReviewsSummary), findsOneWidget);
    expect(find.text('Excelente trabajo'), findsOneWidget);
    expect(find.text('Muy buen servicio'), findsOneWidget);
    expect(find.text('Recomendada'), findsOneWidget);
    expect(find.text('Buena atención'), findsOneWidget);
  });

  testWidgets('shows both action buttons', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Solicitar servicio'), findsOneWidget);
    expect(find.text('Chat'), findsOneWidget);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
