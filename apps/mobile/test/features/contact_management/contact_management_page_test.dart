import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/core/network/http_exceptions.dart';
import 'package:mobile/core/ui/theme/app_theme.dart';
import 'package:mobile/core/ui/widgets/app_empty_state.dart';
import 'package:mobile/core/ui/widgets/app_loading.dart';
import 'package:mobile/features/contact_management/presentation/pages/contact_management_page.dart';
import 'package:mobile/features/contact_management/presentation/widgets/contact_card.dart';
import 'package:mobile/features/contact_management/presentation/widgets/contacts_empty_state.dart';
import 'package:mobile/features/contact_management/presentation/widgets/contacts_statistics.dart';
import 'package:mobile/features/contact_management/repositories/contact_management_repository.dart';
import 'package:mobile/features/contact_management/repositories/mock_contact_management_repository.dart';
import 'package:mobile/contact/entities/contact.dart';
import 'package:mobile/contact/models/contact_type.dart';
import 'package:mobile/profiles/entities/profile.dart';

/// Wraps [MockContactManagementRepository] (already `Future`-returning)
/// so tests can force it to never resolve (loading state), return no
/// contacts (empty state) or throw (error state), without touching
/// the real mock data.
class _FakeContactManagementRepository implements ContactManagementRepository {
  _FakeContactManagementRepository({
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
  final _delegate = MockContactManagementRepository();

  @override
  Future<Profile> getProfile() {
    if (neverResolves) return Completer<Profile>().future;
    if (throwsError) {
      return Future.error(const NetworkHttpException('sin conexión'));
    }
    return _delegate.getProfile();
  }

  @override
  Future<List<Contact>> getContacts() =>
      forceEmpty ? Future.value(const []) : _delegate.getContacts();

  @override
  Future<Contact> createContact({
    required ContactType type,
    required String value,
  }) {
    if (throwsOnWrite) {
      return Future.error(const NetworkHttpException('sin conexión'));
    }
    return _delegate.createContact(type: type, value: value);
  }

  @override
  Future<Contact> updateContact(Contact contact, {required String value}) {
    if (throwsOnWrite) {
      return Future.error(const NetworkHttpException('sin conexión'));
    }
    return _delegate.updateContact(contact, value: value);
  }

  @override
  Future<void> deleteContact(Contact contact) {
    if (throwsOnWrite) {
      return Future.error(const NetworkHttpException('sin conexión'));
    }
    return _delegate.deleteContact(contact);
  }
}

void main() {
  Widget buildApp({ContactManagementRepository? repository}) {
    return MaterialApp(
      theme: AppTheme.light,
      home: Scaffold(
        body: ContactManagementPage(
          repository: repository ?? _FakeContactManagementRepository(),
        ),
      ),
    );
  }

  testWidgets('shows the header', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Mis contactos'), findsOneWidget);
  });

  testWidgets('shows statistics derived from the real contacts', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ContactsStatistics), findsOneWidget);
    // 3 active, 1 inactive, 1 archived.
    expect(find.text('3'), findsOneWidget);
    expect(find.text('1'), findsNWidgets(2));
  });

  testWidgets('shows every mock contact with its value and status', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ContactCard), findsNWidgets(5));
    expect(find.text('camila.torres@example.com'), findsOneWidget);
    expect(find.text('+57 310 456 7890'), findsOneWidget);
    expect(find.text('Activo'), findsNWidgets(3));
    expect(find.text('Inactivo'), findsOneWidget);
    expect(find.text('Archivado'), findsOneWidget);
  });

  testWidgets('shows edit/delete actions for every contact', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Editar'), findsNWidgets(5));
    expect(find.text('Eliminar'), findsNWidgets(5));
  });

  testWidgets('shows the add-contact button', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.text('Agregar contacto'), findsOneWidget);
  });

  testWidgets(
    'tapping "Agregar contacto", filling the form and saving adds a real contact',
    (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pumpAndSettle();

      expect(find.byType(ContactCard), findsNWidgets(5));

      await tester.ensureVisible(find.text('Agregar contacto'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Agregar contacto'));
      await tester.pumpAndSettle();

      await tester.enterText(
        find.widgetWithText(TextFormField, 'Correo electrónico'),
        'nuevo@example.com',
      );
      await tester.tap(find.text('Guardar'));
      await tester.pumpAndSettle();

      expect(find.byType(ContactCard), findsNWidgets(6));
      expect(find.text('nuevo@example.com'), findsOneWidget);
      expect(find.text('Contacto agregado.'), findsOneWidget);
    },
  );

  testWidgets('tapping "Editar", changing the value and saving updates it', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('Editar').first);
    await tester.pumpAndSettle();

    await tester.enterText(
      find.widgetWithText(TextFormField, 'Correo electrónico'),
      'actualizado@example.com',
    );
    await tester.tap(find.text('Guardar'));
    await tester.pumpAndSettle();

    expect(find.text('actualizado@example.com'), findsOneWidget);
    expect(find.text('Contacto actualizado.'), findsOneWidget);
  });

  testWidgets('tapping "Eliminar" and confirming removes the contact', (
    tester,
  ) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();

    expect(find.byType(ContactCard), findsNWidgets(5));

    await tester.tap(find.text('Eliminar').first);
    await tester.pumpAndSettle();

    expect(find.text('Eliminar contacto'), findsOneWidget);
    await tester.tap(find.text('Eliminar').last);
    await tester.pumpAndSettle();

    expect(find.byType(ContactCard), findsNWidgets(4));
    expect(find.text('Contacto eliminado.'), findsOneWidget);
  });

  testWidgets('loading state shows AppLoading instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(
        repository: _FakeContactManagementRepository(neverResolves: true),
      ),
    );
    // The indeterminate CircularProgressIndicator never settles, so
    // pumpAndSettle can't be used — but the message's FadeIn does need
    // a couple of pumps to resolve, or its delayed Future leaves a
    // dangling Timer at test teardown.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    expect(find.byType(AppLoading), findsOneWidget);
    expect(find.byType(ContactCard), findsNothing);
  });

  testWidgets('empty state shows ContactsEmptyState instead of the list', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeContactManagementRepository(forceEmpty: true)),
    );
    await tester.pumpAndSettle();

    expect(find.byType(ContactsEmptyState), findsOneWidget);
    expect(find.byType(ContactCard), findsNothing);
  });

  testWidgets('error state shows a retry action', (tester) async {
    await tester.pumpWidget(
      buildApp(repository: _FakeContactManagementRepository(throwsError: true)),
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
          repository: _FakeContactManagementRepository(throwsOnWrite: true),
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Agregar contacto'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Agregar contacto'));
      await tester.pumpAndSettle();

      await tester.enterText(
        find.widgetWithText(TextFormField, 'Correo electrónico'),
        'nuevo@example.com',
      );
      await tester.tap(find.text('Guardar'));
      await tester.pumpAndSettle();

      expect(find.text('sin conexión'), findsOneWidget);
      expect(find.text('Contacto agregado.'), findsNothing);
      expect(find.byType(ContactCard), findsNWidgets(5));
    },
  );

  testWidgets('a failed delete shows an error snackbar and keeps the contact', (
    tester,
  ) async {
    await tester.pumpWidget(
      buildApp(
        repository: _FakeContactManagementRepository(throwsOnWrite: true),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Eliminar').first);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Eliminar').last);
    await tester.pumpAndSettle();

    expect(find.text('sin conexión'), findsOneWidget);
    expect(find.byType(ContactCard), findsNWidgets(5));
  });
}
