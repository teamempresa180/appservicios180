import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/address/entities/address.dart';
import 'package:mobile/category/models/category_id.dart';
import 'package:mobile/core/di/service_locator.dart';
import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_chip.dart';
import 'package:mobile/features/quote/repositories/mock_quote_repository.dart';
import 'package:mobile/features/quote/repositories/quote_repository.dart';
import 'package:mobile/features/request_service/mock/mock_request_service_data.dart';
import 'package:mobile/features/request_service/presentation/pages/request_service_page.dart';
import 'package:mobile/features/request_service/presentation/widgets/continue_button.dart';
import 'package:mobile/features/request_service/repositories/mock_request_service_repository.dart';
import 'package:mobile/features/request_service/repositories/request_service_repository.dart';
import 'package:mobile/features/request_service/models/request_priority.dart';
import 'package:mobile/features/request_service/presentation/widgets/address_summary.dart';
import 'package:mobile/features/request_service/presentation/widgets/attachments_section.dart';
import 'package:mobile/features/request_service/presentation/widgets/priority_selector.dart';
import 'package:mobile/features/request_service/presentation/widgets/problem_description.dart';
import 'package:mobile/features/request_service/presentation/widgets/provider_summary.dart';
import 'package:mobile/features/request_service/presentation/widgets/schedule_selector.dart';
import 'package:mobile/features/request_service/presentation/widgets/service_summary.dart';
import 'package:mobile/address/models/address_id.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/provider/models/provider_id.dart';
import 'package:mobile/service/models/service_id.dart';

/// Repository whose `createOrder` always fails — used to verify the
/// page surfaces the failure instead of crashing with an unhandled
/// exception (see `RequestServicePage._submit`).
class _FailingRequestServiceRepository implements RequestServiceRepository {
  @override
  Future<Address> getAddress() => Future.value(mockRequestServiceAddress);

  @override
  Future<Order> createOrder({
    required CategoryId categoryId,
    ProviderId? providerId,
    ServiceId? serviceId,
    AddressId? addressId,
    required String title,
    required String description,
    required DateTime scheduledDate,
    required RequestPriority priority,
  }) {
    throw const ServerHttpException(
      'No se pudo crear la solicitud.',
      statusCode: 500,
    );
  }
}

void main() {
  Widget buildApp() {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: RequestServicePage(
          category: mockRequestServiceCategory,
          provider: mockRequestServiceProvider,
          service: mockRequestServiceService,
          profile: mockRequestServiceProfile,
          repository: MockRequestServiceRepository(),
        ),
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
    // The default date is always "tomorrow" (see
    // `defaultRequestServiceScheduledDate` — a fixed past calendar date
    // used to be submittable as-is), so this can't be a fixed literal.
    final tomorrow = DateTime.now().add(const Duration(days: 1));
    final expectedDate =
        '${tomorrow.day.toString().padLeft(2, '0')}/'
        '${tomorrow.month.toString().padLeft(2, '0')}/'
        '${tomorrow.year}';
    expect(find.text(expectedDate), findsOneWidget);
    expect(find.text('10:00'), findsOneWidget);
  });

  testWidgets('shows the address summary', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AddressSummary), findsOneWidget);
    expect(find.text('Casa'), findsOneWidget);
    expect(find.textContaining('Calle 45'), findsOneWidget);
  });

  testWidgets(
    'shows the problem description field empty (not a canned example)',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      expect(find.byType(ProblemDescription), findsOneWidget);
      final field = tester.widget<TextFormField>(
        find.widgetWithText(TextFormField, 'Descripción'),
      );
      expect(field.controller!.text, isEmpty);
    },
  );

  testWidgets('shows the attachments section with no fake attachments', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AttachmentsSection), findsOneWidget);
    // The form used to seed two fake photo tiles into every request, so
    // it looked like the client had already attached evidence that no
    // provider would ever receive. Only the (clearly-labelled) "add"
    // tile and its explanation remain.
    expect(find.text('Foto de la fuga'), findsNothing);
    expect(find.text('Foto del mueble afectado'), findsNothing);
    expect(
      find.textContaining('Podrás enviar fotos por el chat'),
      findsOneWidget,
    );
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

      // The description field starts empty (no canned prefill — see
      // `RequestServiceViewModel.load`), so a real value is required
      // before "Continuar" allows the submit through.
      await tester.ensureVisible(find.byType(ProblemDescription));
      await tester.pumpAndSettle();
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Descripción'),
        'Hay una fuga en la cocina.',
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Continuar'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Continuar'));
      await tester.pumpAndSettle();

      expect(find.text('Solicitud enviada.'), findsOneWidget);
      expect(find.text('Cotización'), findsWidgets);
    },
  );

  testWidgets('open request (no provider/service) skips those summaries', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(
          body: RequestServicePage(
            category: mockRequestServiceCategory,
            repository: MockRequestServiceRepository(),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byType(ServiceSummary), findsNothing);
    expect(find.byType(ProviderSummary), findsNothing);
  });

  testWidgets(
    'shows an error snackbar and re-enables the button when createOrder fails',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: RequestServicePage(
              category: mockRequestServiceCategory,
              provider: mockRequestServiceProvider,
              service: mockRequestServiceService,
              profile: mockRequestServiceProfile,
              repository: _FailingRequestServiceRepository(),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byType(ProblemDescription));
      await tester.pumpAndSettle();
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Descripción'),
        'Hay una fuga en la cocina.',
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Continuar'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Continuar'));
      await tester.pumpAndSettle();

      expect(find.text('No se pudo crear la solicitud.'), findsOneWidget);
      expect(find.text('Cotización'), findsNothing);
      final button = tester.widget<ContinueButton>(
        find.byType(ContinueButton),
      );
      expect(button.isLoading, isFalse);
    },
  );

  testWidgets(
    'blocks submit and shows a validation snackbar when the description is empty',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byType(ProblemDescription));
      await tester.pumpAndSettle();
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Descripción'),
        '   ',
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Continuar'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Continuar'));
      await tester.pumpAndSettle();

      expect(
        find.text('Cuéntanos brevemente qué necesitas antes de continuar.'),
        findsOneWidget,
      );
      expect(find.text('Cotización'), findsNothing);
    },
  );

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });
}
