import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/address/models/address_id.dart';
import 'package:mobile/category/models/category_id.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/features/provider_dashboard/presentation/widgets/active_service_card.dart';
import 'package:mobile/identity/models/identity_id.dart';
import 'package:mobile/order/entities/order.dart';
import 'package:mobile/order/journey/order_journey_action.dart';
import 'package:mobile/order/journey/order_journey_info.dart';
import 'package:mobile/order/journey/order_journey_stage.dart';
import 'package:mobile/order/models/order_id.dart';
import 'package:mobile/order/models/order_priority.dart';
import 'package:mobile/order/models/order_status.dart';
import 'package:mobile/provider/models/provider_id.dart';
import 'package:mobile/service/models/service_id.dart';

/// Covers the "Iniciar navegación" button added for Etapa 12: it must
/// only appear when the order actually has an [Order.addressId] to
/// resolve a real destination from — an order with none (created
/// before this field existed, or otherwise never assigned one) has
/// nothing to navigate to. Resolving the id to a real `Address` and
/// launching Google Maps/Waze both happen in the caller
/// (`ProviderDashboardPage._startNavigation`) via [onNavigate], so this
/// only verifies the button's visibility and tap wiring, not an actual
/// OS app launch (not testable in a widget test).
void main() {
  Order buildOrder({AddressId? addressId}) {
    final now = DateTime(2026, 1, 1);
    return Order(
      id: OrderId.create(),
      identityId: IdentityId.create(),
      categoryId: CategoryId.create(),
      providerId: ProviderId.create(),
      serviceId: ServiceId.create(),
      addressId: addressId,
      title: 'Reparación de fuga de agua',
      description: 'Fuga debajo del lavaplatos de la cocina.',
      scheduledDate: now,
      status: OrderStatus.accepted,
      priority: OrderPriority.medium,
      createdAt: now,
      updatedAt: now,
    );
  }

  const journey = OrderJourneyInfo(
    stage: OrderJourneyStage.scheduled,
    title: 'Servicio agendado',
    description: 'Dirígete a la dirección del cliente.',
    helpMessage: '',
    actions: [
      OrderJourneyAction(
        OrderJourneyActionKind.startService,
        'Comenzar servicio',
      ),
    ],
  );

  Future<void> pump(WidgetTester tester, Widget child) {
    return tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.light,
        home: Scaffold(body: SingleChildScrollView(child: child)),
      ),
    );
  }

  testWidgets(
    'shows "Iniciar navegación" when the order has an addressId',
    (tester) async {
      var tapped = false;
      await pump(
        tester,
        ActiveServiceCard(
          order: buildOrder(addressId: AddressId.create()),
          journey: journey,
          onNavigate: () => tapped = true,
        ),
      );

      final button = find.text('Iniciar navegación');
      expect(button, findsOneWidget);

      await tester.tap(button);
      await tester.pump();
      expect(tapped, isTrue);
    },
  );

  testWidgets(
    'hides "Iniciar navegación" when the order has no addressId',
    (tester) async {
      await pump(
        tester,
        ActiveServiceCard(
          order: buildOrder(addressId: null),
          journey: journey,
          onNavigate: () {},
        ),
      );

      expect(find.text('Iniciar navegación'), findsNothing);
    },
  );
}
