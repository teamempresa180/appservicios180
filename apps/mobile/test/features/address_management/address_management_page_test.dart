import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/address/entities/address.dart';
import 'package:mobile/address/models/address_type.dart';
import 'package:mobile/contact/entities/contact.dart';
import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/address_management/presentation/pages/address_management_page.dart';
import 'package:mobile/features/address_management/presentation/widgets/address_card.dart';
import 'package:mobile/features/address_management/presentation/widgets/addresses_empty_state.dart';
import 'package:mobile/features/address_management/presentation/widgets/default_address_badge.dart';
import 'package:mobile/features/address_management/repositories/address_management_repository.dart';
import 'package:mobile/features/address_management/repositories/mock_address_management_repository.dart';
import 'package:mobile/profiles/entities/profile.dart';

/// Wraps [MockAddressManagementRepository] (already `Future`-returning)
/// so tests can force it to never resolve (loading state), return no
/// addresses (empty state) or throw (error state), without touching
/// the real mock data.
class _FakeAddressManagementRepository implements AddressManagementRepository {
  _FakeAddressManagementRepository({
    this.neverResolves = false,
    this.forceEmpty = false,
    this.throwsError = false,
    this.throwsOnWrite = false,
  });

  final bool neverResolves;
  final bool forceEmpty;
  final bool throwsError;
  /// Forces create/update/delete to fail, so tests can assert the page
  /// surfaces the error instead of silently swallowing it.
  final bool throwsOnWrite;
  final _delegate = MockAddressManagementRepository();

  @override
  Future<List<Address>> getAddresses() {
    if (neverResolves) return Completer<List<Address>>().future;
    if (forceEmpty) return Future.value(const []);
    if (throwsError) {
      return Future.error(const NetworkHttpException('sin conexión'));
    }
    return _delegate.getAddresses();
  }

  @override
  Future<Profile> getProfile() => _delegate.getProfile();

  @override
  Future<Contact> getContactFor(Address address) =>
      _delegate.getContactFor(address);

  @override
  Future<Address> createAddress({
    required String alias,
    required String fullAddress,
    required String city,
    required String state,
    required String country,
    required String postalCode,
    required AddressType type,
    double? latitude,
    double? longitude,
  }) {
    if (throwsOnWrite) {
      return Future.error(const NetworkHttpException('sin conexión'));
    }
    return _delegate.createAddress(
      alias: alias,
      fullAddress: fullAddress,
      city: city,
      state: state,
      country: country,
      postalCode: postalCode,
      type: type,
      latitude: latitude,
      longitude: longitude,
    );
  }

  @override
  Future<Address> updateAddress(
    Address address, {
    required String alias,
    required String fullAddress,
    double? latitude,
    double? longitude,
  }) {
    if (throwsOnWrite) {
      return Future.error(const NetworkHttpException('sin conexión'));
    }
    return _delegate.updateAddress(
      address,
      alias: alias,
      fullAddress: fullAddress,
      latitude: latitude,
      longitude: longitude,
    );
  }

  @override
  Future<void> deleteAddress(Address address) {
    if (throwsOnWrite) {
      return Future.error(const NetworkHttpException('sin conexión'));
    }
    return _delegate.deleteAddress(address);
  }
}

void main() {
  Widget buildApp({AddressManagementRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: AddressManagementPage(
          repository: repository ?? _FakeAddressManagementRepository(),
        ),
      ),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Mis direcciones'), findsOneWidget);
  });

  testWidgets('shows every mock address with its city and state', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AddressCard), findsNWidgets(3));
    expect(find.text('Casa'), findsOneWidget);
    expect(find.text('Trabajo'), findsOneWidget);
    expect(find.text('Oficina'), findsOneWidget);
    expect(find.text('Bogotá, Cundinamarca'), findsNWidgets(3));
  });

  testWidgets('shows the default badge only for the default address', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Principal'), findsOneWidget);
    expect(find.byType(DefaultAddressBadge), findsNWidgets(3));
  });

  testWidgets('shows edit/delete/select actions for every address', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Editar'), findsNWidgets(3));
    expect(find.text('Eliminar'), findsNWidgets(3));
    expect(find.text('Seleccionar'), findsNWidgets(3));
  });

  testWidgets('shows the add-address button', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Agregar dirección'), findsOneWidget);
  });

  testWidgets(
    'tapping "Agregar dirección", filling the form and saving adds a real address',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      expect(find.byType(AddressCard), findsNWidgets(3));

      await tester.ensureVisible(find.text('Agregar dirección'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Agregar dirección'));
      await tester.pumpAndSettle();

      expect(find.text('Agregar dirección'), findsWidgets);

      await tester.enterText(
        find.widgetWithText(TextFormField, 'Alias (Casa, Trabajo...)'),
        'Finca',
      );
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Dirección completa'),
        'Km 5 vía La Vega',
      );
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Ciudad'),
        'La Vega',
      );
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Departamento/Estado'),
        'Cundinamarca',
      );
      await tester.enterText(
        find.widgetWithText(TextFormField, 'País'),
        'Colombia',
      );
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Código postal'),
        '250040',
      );

      await tester.ensureVisible(find.text('Guardar'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Guardar'));
      await tester.pumpAndSettle();

      expect(find.byType(AddressCard), findsNWidgets(4));
      expect(find.text('Finca'), findsOneWidget);
      expect(find.text('Dirección agregada.'), findsOneWidget);
    },
  );

  testWidgets('tapping "Editar", changing the alias and saving updates it', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('Editar').first);
    await tester.pumpAndSettle();

    final aliasField = find.widgetWithText(
      TextFormField,
      'Alias (Casa, Trabajo...)',
    );
    await tester.enterText(aliasField, 'Casa nueva');
    await tester.tap(find.text('Guardar'));
    await tester.pumpAndSettle();

    expect(find.text('Casa nueva'), findsOneWidget);
    expect(find.text('Dirección actualizada.'), findsOneWidget);
  });

  testWidgets('tapping "Eliminar" and confirming removes the address', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(AddressCard), findsNWidgets(3));

    await tester.tap(find.text('Eliminar').first);
    await tester.pumpAndSettle();

    expect(find.text('Eliminar dirección'), findsOneWidget);
    await tester.tap(find.text('Eliminar').last);
    await tester.pumpAndSettle();

    expect(find.byType(AddressCard), findsNWidgets(2));
    expect(find.text('Dirección eliminada.'), findsOneWidget);
  });

  testWidgets('cancelling the delete confirmation keeps the address', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('Eliminar').first);
    await tester.pumpAndSettle();

    await tester.tap(find.text('Cancelar'));
    await tester.pumpAndSettle();

    expect(find.byType(AddressCard), findsNWidgets(3));
  });

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(
        repository: _FakeAddressManagementRepository(neverResolves: true),
      ),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(AddressCard), findsNothing);
  });

  testWidgets('empty state shows AddressesEmptyState instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeAddressManagementRepository(forceEmpty: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AddressesEmptyState), findsOneWidget);
    expect(find.byType(AddressCard), findsNothing);
  });

  testWidgets('error state shows a retry action', (tester) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeAddressManagementRepository(throwsError: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(AppEmptyState), findsOneWidget);
    expect(find.text('Reintentar'), findsOneWidget);
  });

  testWidgets('does not build its own Scaffold', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(Scaffold), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
  });

  testWidgets(
    'a failed create shows an error snackbar and keeps the list unchanged',
    (tester) async {
      await tester.pumpWidget(
        buildApp(
          repository: _FakeAddressManagementRepository(throwsOnWrite: true),
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Agregar dirección'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Agregar dirección'));
      await tester.pumpAndSettle();

      await tester.enterText(
        find.widgetWithText(TextFormField, 'Alias (Casa, Trabajo...)'),
        'Finca',
      );
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Dirección completa'),
        'Km 5 vía La Vega',
      );
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Ciudad'),
        'La Vega',
      );
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Departamento/Estado'),
        'Cundinamarca',
      );
      await tester.enterText(
        find.widgetWithText(TextFormField, 'País'),
        'Colombia',
      );
      await tester.enterText(
        find.widgetWithText(TextFormField, 'Código postal'),
        '250040',
      );

      await tester.ensureVisible(find.text('Guardar'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Guardar'));
      await tester.pumpAndSettle();

      expect(find.text('sin conexión'), findsOneWidget);
      expect(find.text('Dirección agregada.'), findsNothing);
      expect(find.byType(AddressCard), findsNWidgets(3));
    },
  );

  testWidgets('a failed delete shows an error snackbar and keeps the address', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(
        repository: _FakeAddressManagementRepository(throwsOnWrite: true),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Eliminar').first);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Eliminar').last);
    await tester.pumpAndSettle();

    expect(find.text('sin conexión'), findsOneWidget);
    expect(find.byType(AddressCard), findsNWidgets(3));
  });
}
