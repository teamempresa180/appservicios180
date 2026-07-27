import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_chip.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';
import 'package:mobile/features/quote/repositories/quote_repository.dart';
import 'package:mobile/features/request_service/presentation/pages/request_service_page.dart';
import 'package:mobile/features/request_service/repositories/mock_request_service_repository.dart';
import 'package:mobile/features/request_service/presentation/widgets/address_summary.dart';
import 'package:mobile/features/request_service/presentation/widgets/attachments_section.dart';
import 'package:mobile/features/request_service/presentation/widgets/priority_selector.dart';
import 'package:mobile/features/request_service/presentation/widgets/problem_description.dart';
import 'package:mobile/features/request_service/presentation/widgets/provider_summary.dart';
import 'package:mobile/features/request_service/presentation/widgets/schedule_selector.dart';
import 'package:mobile/features/request_service/presentation/widgets/service_summary.dart';

void main() {
  Widget buildApp() {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: RequestServicePage(repository: MockRequestServiceRepository()),
      ),
    );
  }

  testWidgets('shows the header with the service name', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Solicitar servicio'), findsWidgets);
    expect(find.text('Reparación de fuga de agua'), findsWidgets);
  });

  testWidgets('shows the service summary with base price', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ServiceSummary), findsOneWidget);
    expect(find.text('\$45'), findsOneWidget);
  });

  testWidgets('shows the provider summary with name and experience', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProviderSummary), findsOneWidget);
    expect(find.text('Diana Restrepo'), findsOneWidget);
    expect(find.text('8 años de experiencia'), findsOneWidget);
  });

  testWidgets('shows the schedule selector with initial date and time', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ScheduleSelector), findsOneWidget);
    expect(find.text('10/01/2026'), findsOneWidget);
    expect(find.text('10:00'), findsOneWidget);
  });

  testWidgets('shows the address summary', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AddressSummary), findsOneWidget);
    expect(find.text('Casa'), findsOneWidget);
    expect(find.textContaining('Calle 45'), findsOneWidget);
  });

  testWidgets('shows the problem description field prefilled', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ProblemDescription), findsOneWidget);
    expect(find.textContaining('fuga debajo del lavaplatos'), findsOneWidget);
  });

  testWidgets('shows the attachments section with every attachment', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AttachmentsSection), findsOneWidget);
    expect(find.text('Foto de la fuga'), findsOneWidget);
    expect(find.text('Foto del mueble afectado'), findsOneWidget);
  });

  testWidgets('shows the priority selector with the initial priority chosen', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(PrioritySelector), findsOneWidget);
    final chip = tester.widget<AppChip>(find.widgetWithText(AppChip, 'Normal'));
    expect(chip.selected, isTrue);
  });

  testWidgets('shows the continue button', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Continuar'), findsOneWidget);
  });

  testWidgets(
    'tapping "Continuar" creates a real Order and opens the Quote screen',
    (tester) async {
      locator.registerSingleton<QuoteRepository>(MockQuoteRepository());
      addTearDown(locator.reset);
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Continuar'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Continuar'));
      await tester.pumpAndSettle();

      expect(find.text('Solicitud enviada.'), findsOneWidget);
      expect(find.text('Cotización'), findsWidgets);
    },
  );

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
