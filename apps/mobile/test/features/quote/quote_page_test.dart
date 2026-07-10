import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/quote/presentation/pages/quote_page.dart';
import 'package:mobile/features/quote/presentation/widgets/address_resume.dart';
import 'package:mobile/features/quote/presentation/widgets/estimated_time.dart';
import 'package:mobile/features/quote/presentation/widgets/price_breakdown.dart';
import 'package:mobile/features/quote/presentation/widgets/provider_resume.dart';
import 'package:mobile/features/quote/presentation/widgets/quote_notes.dart';
import 'package:mobile/features/quote/presentation/widgets/schedule_resume.dart';
import 'package:mobile/features/quote/presentation/widgets/service_resume.dart';

void main() {
  Widget buildApp() {
    return MaterialApp(
      theme: AppTheme.light,
      home: const Scaffold(body: QuotePage()),
    );
  }

  testWidgets('shows the header with the service name', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Cotización'), findsOneWidget);
    expect(find.text('Reparación de fuga de agua'), findsWidgets);
  });

  testWidgets('shows the service resume with category', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ServiceResume), findsOneWidget);
    expect(find.text('Plomería'), findsOneWidget);
  });

  testWidgets('shows the provider resume with name and experience', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderResume), findsOneWidget);
    expect(find.text('Diana Restrepo'), findsOneWidget);
    expect(find.text('8 años de experiencia'), findsOneWidget);
  });

  testWidgets('shows the address resume', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AddressResume), findsOneWidget);
    expect(find.text('Casa'), findsOneWidget);
  });

  testWidgets('shows the schedule resume with date and time', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ScheduleResume), findsOneWidget);
    expect(find.text('10/01/2026'), findsOneWidget);
    expect(find.text('10:00'), findsOneWidget);
  });

  testWidgets('shows the estimated time from the real Quote entity', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(EstimatedTime), findsOneWidget);
    expect(find.text('60 min'), findsOneWidget);
  });

  testWidgets('shows the price breakdown with the derived total', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(PriceBreakdown), findsOneWidget);
    expect(find.text('\$45.00'), findsOneWidget);
    expect(find.text('\$5.00'), findsOneWidget);
    expect(find.text('-\$5.00'), findsOneWidget);
    expect(find.text('\$8.55'), findsOneWidget);
    // total = 45 + 5 - 5 + 8.55 = 53.55
    expect(find.text('\$53.55'), findsOneWidget);
  });

  testWidgets('shows the quote notes from the real Quote entity', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(QuoteNotes), findsOneWidget);
    expect(find.textContaining('revisión general'), findsOneWidget);
  });

  testWidgets('shows the confirm quote button', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Confirmar solicitud'), findsOneWidget);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
